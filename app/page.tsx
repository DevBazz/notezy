import CreateNote from '@/components/create-note'
import { currentUser } from '@clerk/nextjs/server'
import { syncUser } from '@/app/actions/user.actions'
import React from 'react'

const page = async () => {
  const user = await currentUser();
  await syncUser(); 
  
  return (
    <section>
      {user && <CreateNote />}
    </section>
  )
}

export default page