'use client'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Table } from '@tanstack/react-table'
import { Settings2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

const idToName: { [key: string]: string } = {
  userId: 'User ID', // Hidden by default
  _id: 'Student ID',
  userName: 'Name',
  userEmail: 'Email', // Hidden by default
  isActive: 'Status',
  onBoarded: 'Onboarded', // Hidden by default
  number: 'Phone Number',
  prn: 'PRN',
  batchYear: 'Batch Year',
  department: 'Department',
  cgpa: 'CGPA',
  gender: 'Gender',
  backlogs: 'Backlogs',
  eligibilityOverrides: 'Eligibility Overrides', // Special treatment
  eventsAttended: 'Events Attended', // Special treatment
  isBlacklisted: 'Is Blacklisted',
  isPlaced: 'Is Placed',
  isArchived: 'Is Archived',
  isInterestedInPlacements: 'Is Interested In Placements',
  optedForHigherStudy: 'Opted For Higher Study',
  // isEnrolled: "Is Enrolled",
  enrollmentStatus: 'Enrollment Status',
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='ml-auto hidden h-8 lg:flex'
        >
          <Settings2 className='mr-2 h-3.5 w-3.5' />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[150px]'>
        <ScrollArea className='h-72'>
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide()
            )
            .map((column) => {
              const columnName = idToName[column.id] || column.id
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnName}
                </DropdownMenuCheckboxItem>
              )
            })}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
