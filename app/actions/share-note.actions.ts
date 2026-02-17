'use server'
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { getDbUserId } from "./user.actions";

export const shareRequest = async (noteId: string, receiverId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = await getDbUserId();

    if (!userId) {
      return { success: false, message: "User ID not found" };
    }

    // Prevent self-sharing
    if (userId === receiverId) {
      return { success: false, message: "You cannot share a note with yourself" };
    }

    // Check receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    });

    if (!receiver) {
      return { success: false, message: "Receiver not found" };
    }

    // Check note exists AND user is the owner
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        authorId: userId
      },
      select: { id: true },
    });

    if (!note) {
      return {
        success: false,
        message: "Note not found or you are not the owner",
      };
    }

    // Check existing share state
    const existingShare = await prisma.noteShare.findUnique({
      where: {
        noteId_receiverId: {
          noteId,
          receiverId,
        },
      },
    });

    if (existingShare) {
      if (existingShare.status === "PENDING") {
        return {
          success: false,
          message: "Share request already pending",
        };
      }

      if (existingShare.status === "ACCEPTED") {
        return {
          success: false,
          message: "Note already shared with this user",
        };
      }

      if (existingShare.status === "REJECTED") {
        // optional: allow re-share by updating instead of creating
        await prisma.noteShare.update({
          where: { id: existingShare.id },
          data: { status: "PENDING" },
        });

        await prisma.notification.create({
          data: {
            sharedNoteId: noteId,
            creatorId: user.id,
            receiverId,
            type: "SHARE_REQUEST",
            read: false,
          },
        });

        return {
          success: true,
          message: "Share request sent again",
        };
      }
    }

    // Create new share request + notification atomically
        // Create new share request + notification atomically
    const result = await prisma.$transaction(async (tx) => {
      const noteShare = await tx.noteShare.create({
        data: {
          noteId,
          senderId: userId,
          receiverId,
          status: "PENDING",
          permission: "VIEW",
        },
      });

      await tx.notification.create({
        data: {
          sharedNoteId: noteShare.id,
          creatorId: userId,
          receiverId,
          type: "SHARE_REQUEST",
          read: false,
        },
      });

      return noteShare;
    });

    return { success: true, message: "Share request sent successfully" };
  } catch (error) {
    console.error("Share request error:", error);
    return { success: false, message: "Failed to send share request" };
  }
};


export const acceptShareRequest = async (shareId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = await getDbUserId();

    if (!userId) {
      return { success: false, message: "User ID not found" };
    }

    const share = await prisma.noteShare.findUnique({
      where: { id: shareId },
      select: {
        id: true,
        noteId: true,
        receiverId: true,
        senderId: true,
        status: true,
      },
    });

    if (!share) {
      return { success: false, message: "Share request not found" };
    }

    // Only receiver can accept
    if (share.receiverId !== userId) {
      return { success: false, message: "Unauthorized action" };
    }

    // Only PENDING requests can be accepted
    if (share.status !== "PENDING") {
      return {
        success: false,
        message: `Cannot accept a ${share.status.toLowerCase()} request`,
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.noteShare.update({
        where: { id: shareId },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
      });

      // Update notification for receiver (show "You accepted")
      await tx.notification.updateMany({
        where: {
          sharedNoteId: shareId,
          type: "SHARE_REQUEST",
          receiverId: userId,
        },
        data: {
          type: "SHARE_ACCEPTED",
        },
      });

      // Create notification for sender (show "User accepted your request")
      await tx.notification.create({
        data: {
          sharedNoteId: shareId,
          creatorId: userId,
          receiverId: share.senderId,
          type: "SHARE_ACCEPTED",
          read: false,
        },
      });
    });

    return {
      success: true,
      message: "Share request accepted successfully",
    };
  } catch (error) {
    console.error("Accept share request error:", error);
    return { success: false, message: "Failed to accept share request" };
  }
}


export const rejectShareRequest = async (shareId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = await getDbUserId();

    if (!userId) {
      return { success: false, message: "User ID not found" };
    }

    const share = await prisma.noteShare.findUnique({
      where: { id: shareId },
      select: {
        id: true,
        noteId: true,
        receiverId: true,
        senderId: true,
        status: true,
      },
    });

    if (!share) {
      return { success: false, message: "Share request not found" };
    }

    if (share.receiverId !== userId) {
      return { success: false, message: "Unauthorized action" };
    }

    if (share.status !== "PENDING") {
      return {
        success: false,
        message: `Cannot reject a ${share.status.toLowerCase()} request`,
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.noteShare.update({
        where: { id: shareId },
        data: { status: "REJECTED" },
      });

      // Update notification for receiver (show "You rejected")
      await tx.notification.updateMany({
        where: {
          sharedNoteId: shareId,
          type: "SHARE_REQUEST",
          receiverId: userId,
        },
        data: {
          type: "SHARE_DECLINED",
        },
      });

      // Create notification for sender (show "User rejected your request")
      await tx.notification.create({
        data: {
          sharedNoteId: shareId,
          creatorId: userId,
          receiverId: share.senderId,
          type: "SHARE_DECLINED",
          read: false,
        },
      });
    });

    return { success: true, message: "Share request rejected successfully" };
  } catch (error) {
    console.error("Reject share request error:", error);
    return { success: false, message: "Failed to reject share request" };
  }
};

