import CreateNote from "@/components/create-note";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/app/actions/user.actions";
import { getAllNotes } from "./actions/note.actions";
import NoteCard from "@/components/note-card";

const Page = async () => {
  const user = await currentUser();

  if (user) {
    await syncUser();
  }

  const { success, notes } = await getAllNotes();

  return (
    <section className="w-full flex flex-col gap-6">
      
      {/* Create Button */}
      {user && <CreateNote />}

      {/* Notes Grid */}
      <div className="w-full flex flex-wrap gap-4">
        {notes?.length > 0 ? (
          notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            No notes yet. Create one or wait for someone to share.
          </p>
        )}
      </div>
    </section>
  );
};

export default Page;