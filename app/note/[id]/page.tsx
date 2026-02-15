import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Share2, } from "lucide-react";
import { getNotesById } from "@/app/actions/note.actions";
import { Icons } from "@/utils/Icons";
import DeleteAlertDialog from "@/components/delete-alert-box";

const NotePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  
  const resolvedParams = await params;
  const noteId = resolvedParams.id;

  const data = await getNotesById(noteId);
  const note = data.note;

  const selectedIcon = Icons.find((icon) => icon.name === note?.icon);
  const Icon = selectedIcon?.Icon;


  if (!note) return <p>Note not found</p>;

  return (
    <section className="max-w-3xl mx-auto mt-10 px-4">
      <Card
        className="rounded-3xl shadow-lg border border-border/40 
                   bg-linear-to-br from-background to-muted/40 
                   transition-all duration-300"
        style={{
          boxShadow: note.color
            ? `0 12px 30px -10px ${note.color}40`
            : undefined,
        }}
      >
        <CardHeader className="flex items-center gap-4 px-6 pt-6 pb-2">
          {/* Icon */}
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
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

          {/* Editable Title */}
          <Input
            defaultValue={note.title}
            className="text-xl font-semibold flex-1 border-none"
            placeholder="Note Title"
          />
        </CardHeader>

        <CardContent className="px-6 pt-3 pb-4">
          {/* Editable Content */}
          <Textarea
            defaultValue={note.content}
            className="text-sm  min-h-50 resize-none border-none"
            placeholder="Write your note..."
          />
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-2 flex justify-end gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Share2 className="h-5 w-5" />
          </Button>
          <DeleteAlertDialog noteId={note.id} />
        </CardFooter>
      </Card>
    </section>
  );
};

export default NotePage;
