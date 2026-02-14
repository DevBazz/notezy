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
import { LoaderIcon, PlusIcon, } from "lucide-react"; 
import { Field, FieldGroup } from "./ui/field";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { createNote } from "@/app/actions/note.actions";
import toast from "react-hot-toast";
import {Icons} from "@/utils/Icons"

const CreateNote = () => {
 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>("Star");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const data = {
        title: formData.get("title") as string,
        content: formData.get("note") as string,
        icon: selectedIcon, 
        color: formData.get("color") as string,
      };
      
      if (!data.title.trim() || !data.content.trim()) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
      
      await createNote(data);
      toast.success("Note created successfully!");
      setOpen(false);
      
      
      
      setSelectedIcon("Star"); 
      
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Error creating note. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="my-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-20 h-16 bg-neutral-800 hover:bg-neutral-400 flex justify-center items-center cursor-pointer ">
            <PlusIcon className="text-white hover:text-black" size={25} />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create a New Note</DialogTitle>
          </DialogHeader>
          
          <form  action={handleSubmit}>
            <FieldGroup>
              <Field>
                <Label htmlFor="title">Title *</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="Title" 
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="note">Note *</Label>
                <Textarea id="note" name="note" required />
              </Field>
              <Field>
                <Label>Pick an Icon</Label>
                <input type="hidden" name="icon" value={selectedIcon} />
                <div className="mt-2">
                  <div className="grid grid-cols-5 gap-2">
                    {Icons.map(({ name, Icon }) => {
                      const isSelected = selectedIcon === name;
                      return (
                        <button
                          type="button"
                          key={name}
                          onClick={() => setSelectedIcon(name)}
                          aria-pressed={isSelected}
                          className={`flex items-center justify-center p-2 rounded-md border ${isSelected ? "bg-neutral-700 border-neutral-600" : "bg-transparent border-neutral-800 hover:bg-neutral-900"} transition-colors`}
                        >
                          <Icon
                            size={18}
                            className={
                              isSelected ? "text-white" : "text-neutral-300"
                            }
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Field>
              <Field>
                <Label htmlFor="color">Pick a Color</Label>
                <Input
                  type="color"
                  id="color"
                  name="color"
                  defaultValue="#ffffff"
                />
              </Field>
            </FieldGroup>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                className="cursor-pointer" 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CreateNote;