import prisma from "@/lib/prisma";

export const getAllNotification = async (userId: string) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { receiverId: userId },
            include: {
              creator: true,
              sharedNote: {
                include: {
                  note: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          });

            return {success: true, notifications};
    } catch (error) {
        console.log("Error fetching notifications:", error);
        return {success: false, message: "Error fetching notifications"};
    }
}