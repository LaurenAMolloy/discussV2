interface TopicShowPageProps {
    params: Promise<{
      slug: string;
    }>;
  }

export default async function TopicPageShow({ params }: TopicShowPageProps){
    //destructure 
    const { slug } = await params;
    return (
    <div className="grid grid-cols-4 gap-4 p-4">
        <div className="col-span-3">
            <h1 className="text-2xl font-bold mb-2">
                {slug}
            </h1>
        </div>
    </div>
    )
}