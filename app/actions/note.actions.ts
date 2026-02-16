'use server'
import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { getDbUserId } from "./user.actions";
import { revalidatePath } from "next/cache";

export interface CreateNoteProps {
    title: string;
    content: string;
    icon?: string;
    color?: string
}

export const getAllNotes = async () => {
  try {
    const user = await currentUser()
    if(!user) return {success: false, message: "User not authenticated"}

    const userId = await getDbUserId();
    
    const notes = await prisma.note.findMany({
        where: {
            authorId: userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return {success: true, notes};
  } catch (error) {
    console.log("Error fetching notes:", error)
    return {success: false, message: "Error fetching notes"}
  }
}
 
export const getNotesById = async (noteId: string) => {
    try {
       const user = await currentUser()
       if(!user) return {success: false, message: "Not authorized"}
       
       const note = await prisma.note.findUnique({
        where: {
            id: noteId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            }
          }
        }
       })
       return {success: true, note, message: "Note fetched successfully"};
    } catch (error) {
        console.log("Error fetching note by ID:", error)
        return {success: false, message: "Error fetching note by ID"}
    }
}

export const createNote = async (data: CreateNoteProps) => {
   try {
    const userId = await getDbUserId();

    if (!userId) {
      return {success: false, error: "User not authenticated"}
    }

    const newNote = await prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        icon: data.icon,
        color: data.color,
        authorId: userId
      }
    })
    revalidatePath('/')
    return { success: true, note: newNote };
   } catch (error) {
    console.log("Error creating note:", error)
    return {success: false, message: "Error creating note"}
   }
}

export const updateNoteById = async (noteId: string, data: CreateNoteProps) => {
  try {
    const user = await currentUser()
    if(!user) return null
    const userId = await getDbUserId();

    const updatedNote = await prisma.note.updateMany({
      where: {
        id: noteId,
        authorId: userId
      },
      data: {
        title: data.title,
        content: data.content,
        icon: data.icon,
        color: data.color
      }
    })
    return updatedNote;
  } catch (error) {
    console.log("Error updating note by ID:", error)
    return {success: false, message: "Error updating note"}
  }
}


export const deleteNote = async (noteId: string) => {
  const user = await currentUser();
  if (!user) return { success: false, message: "Unauthorized" };

  const userId = await getDbUserId();
  const dbUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!dbUser) {
    return { success: false, message: "User not found" };
  }

  await prisma.note.delete({
    where: {
      id: noteId,
      authorId: userId,
    },
  });
  revalidatePath('/')
  return { success: true };
};