"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { createNote } from "@/app/actions/note.actions";
import toast from "react-hot-toast";
import { Icons } from "@/utils/Icons";

const PRESET_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f97316",
  "#10b981", "#3b82f6", "#f59e0b", "#ef4444",
];

const CreateNote = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>("Star");
  const [selectedColor, setSelectedColor] = useState<string>("#6366f1");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const data = {
        title: formData.get("title") as string,
        content: formData.get("note") as string,
        icon: selectedIcon,
        color: selectedColor,
      };

      if (!data.title.trim() || !data.content.trim()) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      await createNote(data);
      toast.success("Note created!");
      setOpen(false);
      setSelectedIcon("Star");
      setSelectedColor("#6366f1");
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Error creating note. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 rounded-xl px-5 h-11 font-medium shadow-sm
                     bg-primary text-primary-foreground hover:bg-primary/90
                     transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus size={18} />
          New Note
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl border-border/60 p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-lg font-semibold">Create a new note</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Give your note a title…"
              required
              className="rounded-xl border-border/60 focus-visible:ring-primary/40 h-10"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label htmlFor="note" className="text-sm font-medium">
              Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="note"
              name="note"
              required
              placeholder="What's on your mind…"
              className="rounded-xl border-border/60 focus-visible:ring-primary/40 min-h-28 resize-none"
            />
          </div>

          {/* Icon Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Icon</Label>
            <div className="grid grid-cols-5 gap-2">
              {Icons.map(({ name, Icon }) => {
                const isSelected = selectedIcon === name;
                return (
                  <button
                    type="button"
                    key={name}
                    onClick={() => setSelectedIcon(name)}
                    aria-pressed={isSelected}
                    className={`flex items-center justify-center p-2.5 rounded-xl border transition-all duration-150
                      ${
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground shadow-sm"
                          : "bg-transparent border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                  >
                    <Icon size={16} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Color</Label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full transition-all duration-150 border-2
                    ${selectedColor === color ? "scale-110 border-foreground/60" : "border-transparent hover:scale-105"}`}
                  style={{ backgroundColor: color }}
                  aria-label={color}
                />
              ))}
              {/* Custom color */}
              <label className="relative w-7 h-7 rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-border/60 hover:border-primary/60 transition-colors flex items-center justify-center">
                <span className="text-[10px] text-muted-foreground">+</span>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </label>
            </div>
            {/* Preview swatch */}
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-4 h-4 rounded-full border border-border/40"
                style={{ backgroundColor: selectedColor }}
              />
              <span className="text-xs text-muted-foreground font-mono">{selectedColor}</span>
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-border/60 hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-primary hover:bg-primary/90 min-w-20"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNote;
