import type { Post } from '@prisma/client';
import { db } from '@/db';

export type PostWithData = (
    Post & {
        topic: { slug: string };
        user: { name: string | null };
        _count: { comments: number };
    }
)

//What does this do?
//Looks at what is returned from fetchPosts
//Looks at the promise 
//Looks at the array of objects from the promise
//Looks at the type of ONE element in that array
//export type PostWithData = Awaited<ReturnType<typeof fetchPostsByTopicSlug>>[number];

export function fetchPostsByTopicSlug(slug: string): Promise<PostWithData[]> {
    //This will find all the appropriate posts attached to a given slug
    return db.post.findMany({
        //topics where slug is equal to our argument
        where: { topic: { slug }},
        include: {
            topic: { select: { slug: true } },
            user: { select: { name: true } },
            _count: { select: { comments : true } },
        }
    })
}