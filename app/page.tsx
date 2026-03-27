import CreateNote from "@/components/create-note";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/app/actions/user.actions";
import { getAllNotes } from "./actions/note.actions";
import NoteCard from "@/components/note-card";
import HomeAnimations from "@/components/home-animations";

const Page = async () => {
  const user = await currentUser();

  if (user) {
    await syncUser();
  }

  const { success, notes } = await getAllNotes();

  return (
    <HomeAnimations>
      {/* Header */}
      <div className="gsap-header mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {user ? `Welcome back${user.firstName ? `, ${user.firstName}` : ""}` : "Your Notes"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {notes && notes.length > 0
            ? `You have ${notes.length} note${notes.length > 1 ? "s" : ""}`
            : "Start capturing your thoughts"}
        </p>
      </div>

      {/* Create Button */}
      {user && (
        <div className="gsap-create mb-8">
          <CreateNote />
        </div>
      )}

      {/* Notes Grid */}
      <div className="gsap-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {notes && notes.length > 0 ? (
          notes.map((note, i) => (
            <div key={note.id} className="gsap-card" style={{ "--i": i } as React.CSSProperties}>
              <NoteCard note={note} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-foreground font-medium">No notes yet</p>
            <p className="text-muted-foreground text-sm mt-1">
              {user ? "Create your first note above" : "Sign in to create and view notes"}
            </p>
          </div>
        )}
      </div>
    </HomeAnimations>
  );
};

export default Page;
