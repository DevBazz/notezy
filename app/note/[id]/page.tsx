"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { getNotesById, updateNoteById } from "@/app/actions/note.actions";
import { Icons } from "@/utils/Icons";
import DeleteAlertDialog from "@/components/delete-alert-box";
import toast from "react-hot-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  icon?: string | null;
  color?: string | null;
}

const NotePage = () => {
  const params = useParams();
  const noteId = params.id as string;
  
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const data = await getNotesById(noteId);
        if (data.note) {
          const { id, title, content, icon, color } = data.note;
          setNote({ id, title, content, icon, color });
          setTitle(title || "");
          setContent(content || "");
        } else {
          setNote(null);
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };

    if (noteId) {
      fetchNote();
    }
  }, [noteId]);


  const handleUpdate = async () => {
      try {
        if(title === note?.title && content === note?.content) {
          return;
        }
 
       await updateNoteById(noteId, { title, content });
       toast.success("Saved");      
      } catch (error) {
        toast.error("Error updating note. Please try again.");
        console.error("Error updating note:", error);
      }
  }

  const selectedIcon = Icons.find((icon) => icon.name === note?.icon);
  const Icon = selectedIcon?.Icon;

  if (loading) {
    return (
      <section className="max-w-3xl mx-auto mt-10 px-4">
        <p>Loading...</p>
      </section>
    );
  }

  if (!note) {
    return (
      <section className="max-w-3xl mx-auto mt-10 px-4">
        <p>Note not found</p>
      </section>
    );
  }

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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold flex-1 border-none"
            placeholder="Note Title"
            onBlur={() => handleUpdate()}
          />
        </CardHeader>

        <CardContent className="px-6 pt-3 pb-4">
          {/* Editable Content */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="text-sm min-h-50 resize-none border-none"
            placeholder="Write your note..."
            onBlur={() => handleUpdate()}
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