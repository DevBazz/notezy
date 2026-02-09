import CreateNote from '@/components/create-note'
import {   currentUser } from '@clerk/nextjs/server'
import React from 'react'


const page = async() => {
 
  const user = await currentUser();
  
   
  return (
    <section>
      {user && <CreateNote userId={user.id}/>}
    </section>
  )
}

export default page