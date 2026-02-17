import { Card, CardHeader, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Icons } from "@/utils/Icons";
import Link from "next/link";

type Note = {
  id: string;
  title: string;
  content: string;
  icon: string | null;
  color: string | null;
  isOwner: boolean;
  sharedBy: string | null;
  author: {
    id: string;
    username?: string | null;
    name?: string | null;
  };
};

const NoteCard = ({ note }: { note: Note }) => {
  const previewContent =
    note.content.length > 140
      ? note.content.slice(0, 140) + "..."
      : note.content;

  const selectedIcon = Icons.find((icon) => icon.name === note.icon);
  const Icon = selectedIcon?.Icon;

  const isShared = !note.isOwner;

  const displayName =
    note.sharedBy ??
    note.author?.name ??
    note.author?.username ??
    "Someone";

  const finalTitle = isShared
    ? `${displayName}'s ${note.title}`
    : note.title;

  return (
    <Card
      className="group relative w-80 h-80 rounded-3xl 
                 border border-border/40 
                 bg-gradient-to-br from-background to-muted/40
                 shadow-sm hover:shadow-2xl
                 transition-all duration-300 
                 hover:-translate-y-2 overflow-hidden"
      style={{
        boxShadow: note.color
          ? `0 12px 30px -10px ${note.color}60`
          : undefined,
      }}
    >
      {/* 🔥 Absolute Shared Badge */}
      {isShared && (
        <Badge
          className="absolute top-4 right-4 
                     bg-blue-600 text-white 
                     hover:bg-blue-700 
                     px-3 py-1 text-xs 
                     shadow-md z-10"
        >
          Shared with You
        </Badge>
      )}

      <Link href={`/note/${note.id}`} className="block h-full">
        <CardHeader className="flex flex-col gap-3 px-6 pt-6 pb-4">
          
          {/* Icon */}
          <div
            className="flex h-12 w-12 items-center justify-center 
                       rounded-2xl shadow-sm
                       transition-all duration-300 
                       group-hover:scale-105"
            style={{
              backgroundColor: note.color
                ? `${note.color}20`
                : undefined,
            }}
          >
            {Icon && (
              <Icon
                className="h-5 w-5"
                style={{ color: note.color ?? undefined }}
              />
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold leading-tight line-clamp-2">
            {finalTitle}
          </h3>
        </CardHeader>

        <Separator />

        <CardContent className="px-6 pt-4 pb-6">
          <p className="text-sm text-muted-foreground 
                        line-clamp-5 leading-relaxed">
            {previewContent}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
};

export default NoteCard;