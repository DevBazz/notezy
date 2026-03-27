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
    note.content.length > 120 ? note.content.slice(0, 120) + "…" : note.content;

  const selectedIcon = Icons.find((icon) => icon.name === note.icon);
  const Icon = selectedIcon?.Icon;
  const isShared = !note.isOwner;
  const displayName =
    note.sharedBy ?? note.author?.name ?? note.author?.username ?? "Someone";
  const finalTitle = isShared ? `${displayName}'s ${note.title}` : note.title;

  const accentColor = note.color ?? null;

  return (
    <Link href={`/note/${note.id}`} className="block group h-full">
      <Card
        className="relative h-72 rounded-2xl border border-border/60 overflow-hidden
                   bg-card transition-all duration-300 ease-out
                   hover:-translate-y-1.5 hover:shadow-xl hover:border-border
                   cursor-pointer"
        style={{
          boxShadow: accentColor
            ? `0 4px 24px -8px ${accentColor}50`
            : undefined,
        }}
      >
        {/* Color accent strip */}
        {accentColor && (
          <div
            className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
            style={{ background: accentColor }}
          />
        )}

        {/* Shared badge */}
        {isShared && (
          <Badge
            className="absolute top-3 right-3 z-10 text-[10px] px-2 py-0.5
                       bg-primary/15 text-primary border border-primary/20
                       backdrop-blur-sm font-medium"
          >
            Shared
          </Badge>
        )}

        <CardHeader className="px-5 pt-5 pb-3 flex flex-col gap-3">
          {/* Icon bubble */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center
                       transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: accentColor ? `${accentColor}20` : "oklch(var(--accent))",
            }}
          >
            {Icon ? (
              <Icon
                className="w-5 h-5"
                style={{ color: accentColor ?? "oklch(var(--primary))" }}
              />
            ) : (
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: accentColor ?? "oklch(var(--primary))" }}
              />
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground">
            {finalTitle}
          </h3>
        </CardHeader>

        <Separator className="opacity-40 mx-5 w-auto" />

        <CardContent className="px-5 pt-3 pb-5">
          <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed">
            {previewContent}
          </p>
        </CardContent>

        {/* Hover glow overlay */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                     transition-opacity duration-300 pointer-events-none"
          style={{
            background: accentColor
              ? `radial-gradient(ellipse at top left, ${accentColor}08, transparent 60%)`
              : "radial-gradient(ellipse at top left, oklch(0.52 0.22 270 / 4%), transparent 60%)",
          }}
        />
      </Card>
    </Link>
  );
};

export default NoteCard;
