import PostCreateForm from "@/components/posts/post-create-form";
import PostList from '@/components/posts/post-list';
import { fetchPostsByTopicSlug } from "@/db/queries/posts";

interface TopicShowPageProps {
    params: Promise<{
      slug: string;
    }>;
  }

//params is an object passed ny next to our page
//Our page is dynamic waiting for data/params
//That is why we have a promise
//This allows to create one page that handles many topics

export default async function TopicPageShow({ params }: TopicShowPageProps){
    //destructure the params object
    const { slug } = await params;
    return (
    <div className="grid grid-cols-4 gap-4 p-4">
        <div className="col-span-3">
            <h1 className="text-2xl font-bold mb-2">
                {slug}
            </h1>
            <PostList fetchData={() => fetchPostsByTopicSlug(slug)} />
        </div>
        <div>
            <PostCreateForm slug={slug} />
        </div>
    </div>
    )
}