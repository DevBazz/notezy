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
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        notes: [],
        message: "Unauthorized",
      };
    }

    const userId = await getDbUserId();

    // Get own notes
    const ownNotes = await prisma.note.findMany({
      where: { authorId: userId },
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });

    // Get shared accepted notes
    const sharedNotes = await prisma.noteShare.findMany({
      where: {
        receiverId: userId,
        status: "ACCEPTED",
      },
      include: {
        note: {
          include: { author: true },
        },
      },
    });

    const formattedOwn = ownNotes.map((note) => ({
      ...note,
      isOwner: true,
      sharedBy: null,
    }));

    const formattedShared = sharedNotes.map((share) => ({
      ...share.note,
      isOwner: false,
      sharedBy: share.note.author.username,
    }));

    const combined = [...formattedOwn, ...formattedShared];

    return {
      success: true,
      notes: combined,
    };
  } catch (error) {
    console.error("Error fetching notes:", error);
    return {
      success: false,
      notes: [],
      message: "Error fetching notes",
    };
  }
};
 

export const getNotesById = async (noteId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { success: false, message: "Not authorized" };

    const userId = user.id;

    // Fetch the note and author info
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        shared: {
          where: { receiverId: userId }, // Only shared with this user
          select: {
            id: true,
          },
        },
      },
    });

    if (!note) {
      return { success: false, message: "Note not found" };
    }

    // Determine if the current user is the owner
    const isOwner = note.author.id === userId;

    return {
      success: true,
      note: {
        id: note.id,
        title: note.title,
        content: note.content,
        icon: note.icon,
        color: note.color,
        isOwner,
        // if not owner and shared exists, include sharedBy
        sharedBy: !isOwner && note.shared.length > 0 ? note.author.name : null,
      },
      message: "Note fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching note by ID:", error);
    return { success: false, message: "Error fetching note by ID" };
  }
};

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
  return { success: true };
};