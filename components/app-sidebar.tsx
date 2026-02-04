import React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu } from './ui/sidebar'
import { BellIcon, HomeIcon, NotebookIcon, UserIcon } from 'lucide-react'
import ToggleTheme from './toggle-theme'
import { Separator } from './ui/separator'
import Link from 'next/link'
import { SignIn, UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const AppSidebar = async () => {

    const user  = await auth()

const sidebarItems = [
    { name: 'Home',
      icon: <HomeIcon size={25} className='mr-2 inline-block'/>,
      href: '/'
    },
    {
        name: 'Shared with me',
        icon: <UserIcon size={25} className='mr-2 inline-block'/>,
        href: '/shared'
    },
    {
        name: 'Notifications',
        icon: <BellIcon size={25} className='mr-2 inline-block'/>,
        href: '/notifications'
    }
]

  return (
    <Sidebar>
        <SidebarHeader className='pt-6 flex flex-row pl-6'>
            <NotebookIcon size={30}/>
            <h1 className='font-semibold text-2xl'>Notezy</h1>

           <div className='ml-13'>
            <ToggleTheme />
            </div> 
        </SidebarHeader>
        <Separator className='mt-3'/>

        <SidebarContent>
            <SidebarGroup>
                <SidebarMenu>
                    <ul className='flex items-center justify-center flex-col space-y-4 mt-4 gap-2'>
                        {sidebarItems.map((item) => (
                            <li key={item.name} className='w-full'>
                                <Link href={item.href} className='text-lg flex gap-2 items-center  hover:text-gray-400'>
                                    {item.icon}
                                    {item.name}
                                </Link>
                            </li>
                        ))} 
                    </ul>
                </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className='border-2 rounded-lg mx-2 my-2 h-17 w-60 '>
            <div className='mb-4 mt-2 flex gap-2 items-center'>
              <Avatar className='h-full'>
                <AvatarImage src='/next.svg'/>
                <AvatarFallback>BI</AvatarFallback>
              </Avatar>
              <div>
                <h3 className='text-sm'>Bazan Iqbal</h3>
                <p className='text-sm text-gray-500'>bazan@example.com</p>
              </div>  
            </div>
        </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar