'use server'
import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { getDbUserId } from "./user.actions";
import { revalidatePath } from "next/cache";

interface CreateNoteProps {
    title: string;
    content: string;
    icon?: string;
    color?: string
}

export const getAllNotes = async () => {
  try {
    const user = await currentUser()
    if(!user) return null
    
    const notes = await prisma.note.findMany({
        where: {
            authorId: user.id
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return notes;
  } catch (error) {
    console.log("Error fetching notes:", error)
    return {success: false, message: "Error fetching notes"}
  }
}
 
export const getNotesById = async (noteId: string) => {
    try {
       const user = await currentUser()
       if(!user) return null
       
       const note = await prisma.note.findUnique({
        where: {
            id: noteId,
        }
       })
       return note;
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

    const updatedNote = await prisma.note.updateMany({
      where: {
        id: noteId,
        authorId: user.id
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

export const deleteNoteById = async (noteId: string) => {
  try {
    const user = await currentUser()
    if(!user) return null

    const deletedNote = await prisma.note.deleteMany({
      where: {
        id: noteId,
        authorId: user.id
      }
    })
    return deletedNote;
  } catch (error) {
    console.log("Error deleting note by ID:", error)
    return {success: false, message: "Error deleting note"}
  }
}