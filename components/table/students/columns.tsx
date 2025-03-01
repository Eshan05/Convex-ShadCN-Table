'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Id } from '@/convex/_generated/dataModel'
import { ColumnDef } from '@tanstack/react-table'
import { CheckCheckIcon, UserCheck2, UserCog2Icon, XIcon } from 'lucide-react'
import { DataTableColumnHeader } from '../data-table-column-header'
import { Student } from '../data/student.schema'
import { DataTableRowActions } from './data-table-row-actions'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface EventInfo {
  id: Id<'events'>
  name: string
}

interface StudentTableData
  extends Omit<Student, 'eligibilityOverrides' | 'eventsAttended'> {
  userName: string
  userEmail: string
  coordinatorForEvents: EventInfo[]
  eligibleEvents: EventInfo[]
  ineligibleEvents: EventInfo[]
  eventsAttended: EventInfo[]
}

interface ColumnProps {
  eventIdToName: Record<Id<'events'>, string> // Changed to Id<'events'>
}

export const createColumns = ({
  eventIdToName,
}: ColumnProps): ColumnDef<StudentTableData>[] => {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='flex items-center mr-2'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='flex items-center'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'userId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='User ID' />
      ),
      cell: ({ row }) => {
        ;<div className='w-[80px] py-1 px-1.5 text-xs border rounded overflow-x-auto no-scrollbar'>
          {row.getValue('userId')}
        </div>
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: '_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Student ID' />
      ),
      cell: ({ row }) => (
        <div className='w-[80px] py-1 px-1.5 text-xs border rounded overflow-x-auto no-scrollbar'>
          {row.getValue('_id')}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'userName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Name' />
      ),
      cell: ({ row }) => (
        // <div className='flex items-center gap-1.5'><Badge variant='outline'>{(row.getValue('enrollmentStatus') || 'N/A').toString().charAt(0).toUpperCase() + (row.getValue('enrollmentStatus') || 'N/A').toString().slice(1)}</Badge><span className='truncate font-medium'>{row.getValue('userName')}</span></div>
        <div className='flex items-center gap-1.5'>
          <Badge variant='outline'>{row.getValue('prn')}</Badge>
          <span className='truncate font-medium'>
            {row.getValue('userName')}
          </span>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'userEmail',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Email' />
      ),
      cell: ({ row }) => (
        <div className='max-w-[150px] truncate font-medium'>
          {row.getValue('userEmail')}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'prn',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='PRN' />
      ),
      cell: ({ row }) => <div>{row.getValue('prn')}</div>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: 'number',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Number' />
      ),
      cell: ({ row }) => (
        <div className='max-w-[150px] truncate font-medium'>
          {row.getValue('number')}
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'batchYear',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Batch Year' />
      ),
      cell: ({ row }) => <div>{row.getValue('batchYear')}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'department',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Department' />
      ),
      cell: ({ row }) => <div>{row.getValue('department')}</div>,
      enableSorting: true,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'cgpa',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CGPA' />
      ),
      cell: ({ row }) => <div>{row.getValue('cgpa')}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'backlogs',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Backlogs' />
      ),
      cell: ({ row }) => <div>{row.getValue('backlogs')}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'gender',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Gender' />
      ),
      cell: ({ row }) => <div>{row.getValue('gender')}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'coordinatorForEvents',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Coordinator' />
      ),
      cell: ({ row }) => {
        const events: EventInfo[] = row.getValue('coordinatorForEvents')
        return (
          <div className='flex justify-center'>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <UserCog2Icon className='h-4 w-4' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-60 p-0'>
                <ScrollArea className='h-24 w-60 rounded-md border'>
                  <div className='p-4'>
                    <h4 className='mb-4 text-sm font-medium leading-none'>
                      Coordinator for
                    </h4>
                    {events.map(
                      (event) =>
                        (
                          <>
                            <div key={event.id} className='text-sm'>
                              {event.name}
                            </div>
                            <Separator className='my-1' />
                          </>
                        ) || 'N/A'
                    )}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'eligibleEvents',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Eligible' />
      ),
      cell: ({ row }) => {
        const events: EventInfo[] = row.getValue('eligibleEvents')
        return (
          <div className='flex items-center'>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <CheckCheckIcon className='h-4 w-4' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-60 p-0'>
                <ScrollArea className='h-24 w-60 rounded-md border'>
                  <div className='p-4'>
                    <h4 className='mb-4 text-sm font-medium leading-none'>
                      Eligible Override
                    </h4>
                    {events.map(
                      (event) =>
                        (
                          <>
                            <div key={event.id} className='text-sm'>
                              {event.name}
                            </div>
                            <Separator className='my-1' />
                          </>
                        ) || 'N/A'
                    )}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'ineligibleEvents',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Ineligible' />
      ),
      cell: ({ row }) => {
        const events: EventInfo[] = row.getValue('ineligibleEvents')
        return (
          <div className='flex items-center'>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <XIcon className='h-4 w-4' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-60 p-0'>
                <ScrollArea className='h-24 w-60 rounded-md border'>
                  <div className='p-4'>
                    <h4 className='mb-4 text-sm font-medium leading-none'>
                      Ineligible Override
                    </h4>
                    {events.map(
                      (event) =>
                        (
                          <>
                            <div key={event.id} className='text-sm'>
                              {event.name}
                            </div>
                            <Separator className='my-1' />
                          </>
                        ) || 'N/A'
                    )}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'eventsAttended',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Attended' />
      ),
      cell: ({ row }) => {
        const events: EventInfo[] = row.getValue('eventsAttended')
        return (
          <div className='flex items-center'>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <UserCheck2 className='h-4 w-4' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-60 p-0'>
                <ScrollArea className='h-24 rounded-md border'>
                  <div className='p-4'>
                    <h4 className='mb-4 text-sm font-medium leading-none'>
                      Attended
                    </h4>
                    {events.map(
                      (event) =>
                        (
                          <>
                            <div key={event.id} className='text-sm'>
                              {event.name}
                            </div>
                            <Separator className='my-1' />
                          </>
                        ) || 'N/A'
                    )}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'isBlacklisted',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Blacklisted' />
      ),
      cell: ({ row }) => (
        <div>{row.getValue('isBlacklisted') ? 'Yes' : 'No'}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'isPlaced',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Placed' />
      ),
      cell: ({ row }) => <div>{row.getValue('isPlaced') ? 'Yes' : 'No'}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'isInterestedInPlacements',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Placements' />
      ),
      cell: ({ row }) => (
        <div>
          {row.getValue('isInterestedInPlacements')
            ? 'Interested'
            : 'Not Interested'}
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'optedForHigherStudy',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Higher Study' />
      ),
      cell: ({ row }) => (
        <div>
          {row.getValue('optedForHigherStudy') ? 'Opted' : 'Not Pursing'}
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'enrollmentStatus',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Enrollment Status' />
      ),
      cell: ({ row }) => (
        <div>
          {(row.getValue('enrollmentStatus') || 'N/A')
            .toString()
            .charAt(0)
            .toUpperCase() +
            (row.getValue('enrollmentStatus') || 'N/A').toString().slice(1)}
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'isArchived',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Archived' />
      ),
      cell: ({ row }) => <div>{row.getValue('isArchived') ? 'Yes' : 'No'}</div>,
      enableSorting: true,
      enableHiding: true,
    },

    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          data={[
            {
              ...row.original,
            },
          ]}
        />
      ),
    },
  ]
}
