"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteNote } from "@/app/actions/note.actions";
import toast from "react-hot-toast";

interface DeleteAlertDialogProps {
  noteId: string;
}

export default function DeleteAlertDialog({ noteId }: DeleteAlertDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteNote(noteId);
      if (result?.success) {
        toast.success("Note deleted");
        setIsOpen(false);
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete note.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-2 border-destructive/30 text-destructive
                     hover:bg-destructive/10 hover:border-destructive/50
                     transition-all duration-200 text-xs"
          onClick={() => setIsOpen(true)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl border-border/60 max-w-sm">
        <AlertDialogHeader>
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-2">
            <Trash2 className="w-6 h-6 text-destructive" />
          </div>
          <AlertDialogTitle className="text-base font-semibold">
            Delete this note?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            This action is permanent and cannot be undone. The note will be removed for everyone it was shared with.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            disabled={isDeleting}
            className="rounded-xl border-border/60 flex-1"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="rounded-xl bg-destructive hover:bg-destructive/90 flex-1 gap-2"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
