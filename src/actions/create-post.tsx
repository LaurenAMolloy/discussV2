'use server'
import type { Post } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/auth';
import paths from '@/path';
import { db } from '@/db'


//Source of Truth
//Enforces validation
const createPostSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(10)
});

//Shape of data returned from server action
//Mirrors what the UI expects!
interface CreatePostFormState {
    errors: {
        title?: string[],
        content?: string[],
        _form?: string[]
    }
}

//First argument previous formstate
//Second argument raw form submission
//What we expect is the NEW form state!
export async function createPost(
    slug: string,
    formState: CreatePostFormState,
    formData: FormData
    ): Promise<CreatePostFormState> {
    
    //safeParse will not throw an error!
    //always returns { success: false, error }
    //or { success: true, data }
    const result = createPostSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content')
    });

    //Look at the success property
    //Return errors property if required
    if(!result.success) {
        return {
            //flatten gives use the errors which match our interface only!
            errors: result.error.flatten().fieldErrors
        }
    }
    
    //checking auth status!
    const session = await auth();
    if(!session || !session.user || !session.user.id) {
        return {
            errors: {
                _form: ['You must be signed in to do this']
            }
        }
    }

    //Reach into db and find the topic with slug
    const topic = await db.topic.findFirst({
        where: { slug }
    });

    if(!topic) {
        return {
            errors: {
                _form: ['Cannot find topic!']
            }
        }
    }

    let post: Post;

    try {
        post = await db.post.create({
            data: {
                title: result.data.title,
                content: result.data.content,
                userId: session.user.id,
                topicId: topic.id
            }
        });

    } catch(err: unknown) {
        if(err instanceof Error) {
            return {
                errors: {
                    _form: [err.message]
                }
            };

        } else {
            return {
                errors: {
                    _form: ['Failed to create post']
                }
            }
        } 
    }

    revalidatePath(paths.topicShowPath(slug));
    //Send user to new post page
    redirect(paths.postShowPath(slug, post.id ))
}
