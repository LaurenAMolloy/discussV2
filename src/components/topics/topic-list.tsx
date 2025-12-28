import Link from 'next/link'
import { Chip } from '@nextui-org/react';
import { db } from '@/db';
import paths from '@/path'

export default async function TopicList() {
    //Grab the list from the db!
    const topics = await db.topic.findMany();
    
    //map over topics!
    const renderedTopics = topics.map((topic) => {
        return (
            <div key={topic.id}>
                <Link href={paths.topicShowPath(topic.slug)}>
                    <Chip color="warning" variant="shadow">
                        {topic.slug}
                    </Chip>
                </Link>
            </div>
        )
    });

    return <div className="flex flex-row flex-wrap gap-2">
        {renderedTopics}
    </div>
}