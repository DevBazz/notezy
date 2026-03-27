import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { getDbUserId } from "../actions/user.actions";
import NotificationActions from "@/components/notification-actions";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAllNotification } from "../actions/notification-actions";
import NotificationsAnimations from "@/components/notifications-animations";
import { BellIcon } from "lucide-react";

const NotificationsPage = async () => {
  const user = await currentUser();
  const userId = await getDbUserId();
  const response = userId
    ? await getAllNotification(userId)
    : { notifications: [] };
  const notifications = Array.isArray(response)
    ? response
    : response.notifications || [];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <BellIcon className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="font-medium">Sign in to view notifications</p>
        <p className="text-sm text-muted-foreground mt-1">
          You need to be signed in to see your notifications.
        </p>
      </div>
    );
  }

  const getNotificationText = (type: string, creatorName: string) => {
    switch (type) {
      case "SHARE_REQUEST":
        return `wants to share a note with you`;
      case "SHARE_ACCEPTED":
        return `accepted your share request`;
      case "SHARE_DECLINED":
        return `declined your share request`;
      default:
        return "sent you a notification";
    }
  };

  return (
    <NotificationsAnimations>
      {/* Page header */}
      <div className="gsap-header mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BellIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              {notifications.length > 0
                ? `${notifications.length} notification${notifications.length > 1 ? "s" : ""}`
                : "All caught up"}
            </p>
          </div>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <BellIcon className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p className="font-medium text-foreground">No notifications yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            When someone shares a note with you, it'll appear here.
          </p>
        </div>
      ) : (
        <div className="max-w-2xl space-y-3">
          {notifications.map((n, i) => {
            const shared = n.sharedNote;
            const note = shared?.note;
            const creatorName =
              n.creator?.username ?? n.creator?.name ?? "Someone";

            return (
              <div
                key={n.id}
                className="gsap-item flex flex-col sm:flex-row sm:items-center sm:justify-between
                           gap-4 p-4 rounded-2xl border border-border/60 bg-card
                           hover:border-border transition-all duration-200 hover:shadow-sm"
                style={{ "--i": i } as React.CSSProperties}
              >
                {/* Left */}
                <div className="flex gap-3 flex-1 min-w-0">
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {creatorName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-0.5 min-w-0">
                    <p className="text-sm leading-snug">
                      <span className="font-semibold">{creatorName}</span>{" "}
                      <span className="text-muted-foreground">
                        {getNotificationText(n.type, creatorName)}
                      </span>
                    </p>

                    {note && (
                      <Link
                        href={`/note/${note.id}`}
                        className="text-xs text-primary hover:underline font-medium truncate block"
                      >
                        "{note.title}"
                      </Link>
                    )}

                    <p className="text-xs text-muted-foreground/70">
                      {new Date(n.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {n.type === "SHARE_REQUEST" && shared?.status === "PENDING" && (
                    <NotificationActions shareId={shared.id} />
                  )}

                  {shared?.status === "ACCEPTED" && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs">
                      ✓ Accepted
                    </Badge>
                  )}

                  {shared?.status === "REJECTED" && (
                    <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs">
                      ✗ Declined
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </NotificationsAnimations>
  );
};

export default NotificationsPage;
