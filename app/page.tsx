import CreateNote from '@/components/create-note'
import { currentUser } from '@clerk/nextjs/server'
import { getDbUserId, syncUser } from '@/app/actions/user.actions'
import { getAllNotes } from './actions/note.actions'
import NoteCard from '@/components/note-card'


const page = async () => {
  const user = await currentUser();
  await syncUser();
  const {notes} = await getAllNotes();
  const userId = await getDbUserId();
  
  return (
    <section className='w-full flex flex-col gap-6'>
      {user && <CreateNote />}
       
       <div className='w-full flex flex-wrap gap-3 flex-row'>
         { notes?.map((note) => (
          <NoteCard key={note.id} note={note}/>
        ))}
       </div>
    </section>
  )
}

export default page