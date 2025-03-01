'use client'

import { ChevronsUpDown, CogIcon, FlagIcon, Heart, LogOut } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Doc } from '@/convex/_generated/dataModel'
import { UserInterface } from '@/types/tables'
import { useAuthActions } from '@convex-dev/auth/react'
import Link from 'next/link'

export function NavUser({
  user,
}: {
  user: Doc<'users'> | UserInterface | undefined | null
}) {
  const { isMobile } = useSidebar()
  const { signOut } = useAuthActions()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={''} alt={user?.name || ''} />
                <AvatarFallback className='rounded-lg'>
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {user?.name || 'Unknown'}
                </span>
                <span className='truncate text-xs'>
                  {user?.email || 'No Mail'}
                </span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={''} alt={user?.name || 'Unknown'} />
                  <AvatarFallback className='rounded-lg'>
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>
                    {user?.name || 'Unknown'}
                  </span>
                  <span className='truncate text-xs'>
                    {user?.email || 'No Mail'}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className='cursor-pointer'>
                <CogIcon />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer'>
                <FlagIcon />
                Report | Feedback
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={() => void signOut()}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
            <div className='flex items-center justify-center gap-2 p-2 text-xs text-muted-foreground'>
              <Heart className='w-4 h-4 text-red-400/50 animate-pulse' />
              <span className='text-muted-foreground'>
                Made by{' '}
                <Link
                  href='https://github.com/ACES-RMDSSOE'
                  className='hover:underline'
                >
                  ACES
                </Link>
              </span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
