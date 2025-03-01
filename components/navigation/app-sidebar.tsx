'use client'

import { useAuth } from '@/context/UserContext'
import {
  BookOpen,
  ChartArea,
  FileQuestionIcon,
  Frame,
  Newspaper,
  User2Icon,
  UserPlus2Icon,
} from 'lucide-react'
import * as React from 'react'

import { NavMain } from '@/components/navigation/nav-main'
import { NavUser } from '@/components/navigation/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'

const data = {
  navMain: [
    {
      title: 'View Students',
      url: '/v1/students',
      icon: User2Icon,
    },
    {
      title: 'View Events',
      url: '/v1/events',
      icon: BookOpen,
    },
    {
      title: 'View Users',
      url: '/v1/users',
      icon: ChartArea,
    },
    {
      title: 'Create Events',
      url: '/v1/create',
      icon: Newspaper,
    },
    {
      title: 'Create Students',
      url: '/v1/signup',
      icon: UserPlus2Icon,
    },
    {
      title: 'FAQs',
      url: '#',
      icon: FileQuestionIcon,
    },
  ],
}

export default function v1Sidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading, isAuthenticated } = useAuth()
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export function AppSidebarSkeleton() {
  return (
    <Sidebar collapsible='icon'>
      <SidebarContent>
        <Skeleton className='h-12 w-full' />
        <Skeleton className='h-12 w-full' />
      </SidebarContent>
      <SidebarFooter>
        <Skeleton className='h-12 w-full' />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
