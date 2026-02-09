'use server'

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
    try {
        const {userId} = await auth()
        const user = await currentUser()

        if(!userId || !user) return;

        const existingUser = await prisma.user.findUnique({
            where: {
                clerkId: userId,
            }
        })

       if(existingUser) return existingUser;
       
       const dbUSer = await prisma.user.create({
        data: {
            clerkId: userId,
            name: `${user.firstName || ""} ${user.lastName}`,
            username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
            email: user.emailAddresses[0].emailAddress,
            image: user.imageUrl
        }
       })

       return dbUSer
    } catch (error) {
        console.log("Error creating user", error)
    }
}

export async function getUserByClerkId(clerkId: string){
  const user = await prisma.user.findUnique({
    where: {
        clerkId
    },
})
return user;
}

export async function getDbUserId() {
    const {userId:clerkId} = await auth()
    if(!clerkId) return ;

    const user = await getUserByClerkId(clerkId)
    if(!user) return; 
        
    return user.id    
}
