import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu } from './ui/sidebar'
import { BellIcon, HomeIcon, NotebookIcon, UserIcon } from 'lucide-react'
import ToggleTheme from './toggle-theme'
import { Separator } from './ui/separator'
import Link from 'next/link'

const AppSidebar = () => {

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
                    <ul className='flex items-center justify-center flex-col space-y-4 mt-4'>
                        {sidebarItems.map((item) => (
                            <li key={item.name} className='w-full'>
                                <Link href={item.href} className='text-lg flex items-center font-semibold hover:text-gray-400'>
                                    {item.icon}
                                    {item.name}
                                </Link>
                            </li>
                        ))} 
                    </ul>
                </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar