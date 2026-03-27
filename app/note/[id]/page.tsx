"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getNotesById, updateNoteById } from "@/app/actions/note.actions";
import { Icons } from "@/utils/Icons";
import DeleteAlertDialog from "@/components/delete-alert-box";
import ShareDialog from "@/components/share-dialog";
import toast from "react-hot-toast";
import { gsap } from "gsap";
import { Badge } from "@/components/ui/badge";

interface Note {
  id: string;
  title: string;
  content: string;
  icon?: string | null;
  color?: string | null;
  isOwner?: boolean;
}

const NotePage = () => {
  const params = useParams();
  const noteId = params.id as string;
  const containerRef = useRef<HTMLDivElement>(null);

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const data = await getNotesById(noteId);
        if (data.note) {
          const { id, title, content, icon, color, isOwner } = data.note;
          setNote({ id, title, content, icon, color, isOwner });
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

    if (noteId) fetchNote();
  }, [noteId]);

  // GSAP entrance after note loads
  useEffect(() => {
    if (!loading && note && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
      );
    }
  }, [loading, note]);

  const handleUpdate = async () => {
    if (!note?.isOwner) return;
    if (title === note.title && content === note.content) return;
    try {
      await updateNoteById(noteId, { title, content });
      toast.success("Saved");
    } catch (error) {
      toast.error("Error saving note.");
      console.error(error);
    }
  };

  const selectedIcon = Icons.find((icon) => icon.name === note?.icon);
  const Icon = selectedIcon?.Icon;
  const accentColor = note?.color ?? null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading note…</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="font-medium text-foreground">Note not found</p>
        <p className="text-sm text-muted-foreground mt-1">This note may have been deleted or you don't have access.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto">
      {/* Card */}
      <div
        className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm"
        style={{
          boxShadow: accentColor ? `0 8px 32px -8px ${accentColor}40` : undefined,
        }}
      >
        {/* Color strip */}
        {accentColor && (
          <div className="h-1 w-full" style={{ background: accentColor }} />
        )}

        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center gap-4">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: accentColor ? `${accentColor}18` : "oklch(var(--accent))",
            }}
          >
            {Icon ? (
              <Icon className="w-6 h-6" style={{ color: accentColor ?? undefined }} />
            ) : (
              <div className="w-3 h-3 rounded-full bg-primary" />
            )}
          </div>

          {/* Title input */}
          <div className="flex-1 min-w-0">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold border-none shadow-none px-0 h-auto
                         focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50"
              placeholder="Note title…"
              onBlur={handleUpdate}
              readOnly={!note.isOwner}
            />
          </div>

          {/* Badges */}
          {!note.isOwner && (
            <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs flex-shrink-0">
              View only
            </Badge>
          )}
        </div>

        <div className="h-px bg-border/50 mx-6" />

        {/* Content */}
        <div className="px-6 py-5">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="text-sm leading-relaxed min-h-64 resize-none border-none shadow-none
                       px-0 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50"
            placeholder="Write your note here…"
            onBlur={handleUpdate}
            readOnly={!note.isOwner}
          />
        </div>

        {/* Footer — owner only */}
        {note.isOwner && (
          <>
            <div className="h-px bg-border/50 mx-6" />
            <div className="px-6 py-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Changes save automatically on blur
              </p>
              <div className="flex items-center gap-2">
                <ShareDialog noteId={note.id} />
                <DeleteAlertDialog noteId={note.id} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotePage;
