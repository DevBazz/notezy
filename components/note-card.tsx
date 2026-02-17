import { Trash2, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Icons } from "@/utils/Icons";
import { Separator } from "./ui/separator";
import Link from "next/link";

type Note = {
  id: string;
  title: string;
  content: string;
  icon: string | null;
  color: string | null;
};

const NoteCard = ({ note }: { note: Note }) => {


  const previewContent =
    note.content.length > 120
      ? note.content.slice(0, 120) + "..."
      : note.content;

  const selectedIcon = Icons.find((icon) => icon.name === note.icon)
  const Icon = selectedIcon?.Icon

  return (
    <Card
  className="group relative w-56 h-64 rounded-3xl border border-border/40 
             bg-linear-to-br from-background to-muted/40 
             shadow-sm hover:shadow-xl 
             transition-all duration-300 hover:-translate-y-2"
  style={{
    boxShadow: note.color
      ? `0 10px 25px -8px ${note.color}60`
      : undefined,
  }}
>

  {/* CLICKABLE AREA */}
  <Link href={`note/${note.id}`} className="block">
    <CardHeader className="flex items-center gap-3 px-4 pt-4 pb-3">
      
      {/* Icon */}
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center 
                   rounded-2xl shadow-sm transition-all duration-300 
                   group-hover:scale-105"
        style={{
          backgroundColor: note.color ? `${note.color}20` : undefined,
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
      <h3 className="text-lg font-semibold truncate leading-tight">
        {note.title}
      </h3>
    </CardHeader>

    <Separator />

    <CardContent className="px-4 pt-3 pb-2">
      <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
        {previewContent}
      </p>
    </CardContent>
  </Link>

</Card>
  );
};

export default NoteCard;
