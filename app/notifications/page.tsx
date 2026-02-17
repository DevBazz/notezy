import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { getDbUserId } from "../actions/user.actions";
import NotificationActions from "@/components/notification-actions";
import {  Card,  CardHeader, CardTitle, CardContent,} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAllNotification } from "../actions/notification-actions";

const NotificationsPage = async () => {
  const user = await currentUser();
  const userId = await getDbUserId();
  const response = userId ? await getAllNotification(userId) : { notifications: [] };
  const notifications = Array.isArray(response) ? response : response.notifications || [];

  if (!user) {
    return (
      <main className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please sign in to view your notifications.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }


  const getNotificationText = (type: string, creatorName: string) => {
    switch (type) {
      case "SHARE_REQUEST":
        return `${creatorName} sent you a share request`;
      case "SHARE_ACCEPTED":
        return `${creatorName} accepted your share request`;
      case "SHARE_DECLINED":
        return `${creatorName} declined your share request`;
      default:
        return "You have a new notification";
    }
  };

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <Card className="rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Notifications
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              You have no notifications.
            </div>
          ) : (
            <ScrollArea className="h-[500px] px-6">
              <div className="space-y-6 py-6">
                {notifications.map((n) => {
                  const shared = n.sharedNote;
                  const note = shared?.note;
                  const creatorName =
                    n.creator?.username ??
                    n.creator?.name ??
                    "Someone";

                  return (
                    <div
                      key={n.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-xl p-4 bg-background hover:bg-muted/40 transition"
                    >
                      {/* LEFT SIDE */}
                      <div className="flex gap-4 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {creatorName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-semibold">
                              {creatorName}
                            </span>{" "}
                            <span className="text-muted-foreground">
                              {getNotificationText(n.type, creatorName)}
                            </span>
                          </p>

                          {note && (
                            <Link
                              href={`/note/${note.id}`}
                              className="text-sm font-medium underline hover:text-primary"
                            >
                              {note.title}
                            </Link>
                          )}

                          <p className="text-xs text-muted-foreground">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* RIGHT SIDE */}
                      <div className="flex items-center gap-2">
                        {/* Action Buttons */}
                        {n.type === "SHARE_REQUEST" &&
                          shared?.status === "PENDING" && (
                            <NotificationActions shareId={shared.id} />
                          )}

                        {/* Accepted Badge */}
                        {shared?.status === "ACCEPTED" && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 
                                       dark:bg-green-900/40 dark:text-green-400"
                          >
                            ✓ Accepted
                          </Badge>
                        )}

                        {/* Rejected Badge */}
                        {shared?.status === "REJECTED" && (
                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-700 
                                       dark:bg-red-900/40 dark:text-red-400"
                          >
                            ✗ Rejected
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default NotificationsPage;