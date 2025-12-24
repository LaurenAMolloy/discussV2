'use client'

import { useSession } from 'next-auth/react';

export default function Profile() {
    const session = useSession();

    if(session.data?.user) {
        return <div>From client: User is Signed In</div>
    }

    return <div>From Client: User is Not Signed In</div>
}