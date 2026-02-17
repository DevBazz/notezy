import React from "react";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import NotificationActions from "@/components/notification-actions";

const NotificationsPage = async () => {
  const user = await currentUser();

  if (!user) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="mt-4">Please sign in to view your notifications.</p>
      </main>
    );
  }

  const notifications = await prisma.notification.findMany({
    where: { receiverId: user.id },
    include: {
      creator: true,
      sharedNote: {
        include: { note: true, sender: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="mt-4">You have no notifications.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {notifications.map((n) => {
            const shared = n.sharedNote;
            const note = shared?.note;

            return (
              <li
                key={n.id}
                className="border p-4 rounded-md flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>{n.creator?.username ?? n.creator?.name ?? "Someone"}</strong>
                    {n.type === "SHARE_REQUEST" && (
                      <span> sent you a share request</span>
                    )}
                    {n.type === "SHARE_ACCEPTED" && (
                      <span> accepted your share request</span>
                    )}
                    {n.type === "SHARE_DECLINED" && (
                      <span> declined your share request</span>
                    )}
                  </p>

                  {note && (
                    <p className="mt-1 text-base">
                      Note: <Link href={`/note/${note.id}`} className="underline">{note.title}</Link>
                    </p>
                  )}
                </div>

                {n.type === "SHARE_REQUEST" && shared && (
                  <div className="flex-shrink-0">
                    <NotificationActions shareId={shared.id} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
};

export default NotificationsPage;
