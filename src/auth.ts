import NextAuth from 'next-auth';
import Github from 'next-auth/providers/github';
//Prisma adapter reaches into the db and creates a user record
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from "@/db";
import { Session, User } from 'next-auth';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

//If we do not have the credentials throw an error
if(!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error("Missing github oath credentials")
}

//CONFIG OBJECT TO RETURN PROPERTIES ACROSS OUR APP!
//We have destructured all of the properties required to signin etc
export const { handlers: { GET, POST }, auth, signOut, signIn } = NextAuth({
    adapter: PrismaAdapter(db),
    providers: [
        Github({
            clientId: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET
        })
    ],
    callbacks: {
        //Usually not needed, fixing a bug!
        async session({ session, user }: { session: Session; user: User }){
            if(session && user && session.user) {
                session.user.id = user.id
            }
            return session;
        }
    }
})