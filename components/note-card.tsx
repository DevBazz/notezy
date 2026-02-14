import { Trash2, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Icons } from "@/utils/Icons";

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
      className="w-52 h-56 rounded-2xl shadow-md border-2 "
      style={{
        
        boxShadow: `0 8px 20px -6px ${note.color}40`,
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl ">
            {Icon && <Icon className="h-5 w-5" />}
          </div>
          <h3 className="text-lg font-semibold truncate max-w-45">
            {note.title}
          </h3>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {previewContent}
        </p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Share2 className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-xl">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
