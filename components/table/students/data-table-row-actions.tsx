'use client'

import { Row } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { StudentTableData } from '@/app/(root)/v1/students/studentTable'
import { exportToCSV, exportToJSON } from '@/utils/utils'
import { useState } from 'react'
import { studentSchema, Student } from '../data/student.schema'
import { Id } from '@/convex/_generated/dataModel'
import { DeleteDialog } from '@/components/dialogs/deleteDialog'
import { EditStudentForm } from '@/app/(root)/v1/students/editStudent'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DataTableRowActionsProps<TData> {
  row: Row<TData | StudentTableData>
  data: StudentTableData[]
}

export function DataTableRowActions<TData>({
  row,
  data,
}: DataTableRowActionsProps<TData>) {
  const studentRow = row.original as StudentTableData
  const student = studentSchema.parse(row.original)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Open the edit dialog
  const handleEditClick = () => {
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleExportCSV = () => {
    if (!data || data.length === 0) {
      console.error('No data available for export.')
      return
    }
    exportToCSV([studentRow])
  }

  const handleExportJSON = () => {
    if (!data || data.length === 0) {
      console.error('No data available for export.')
      return
    }
    exportToJSON([studentRow])
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON}>
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={student.isArchived ? 'Active' : 'Inactive'}
            >
              <DropdownMenuRadioItem key='Active' value='true'>
                Active
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem key='Inactive' value='false'>
                Inactive
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {studentRow.eventsAttended!.length > 0 && (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Events Attended</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {studentRow.eventsAttended?.map((event) => (
                    <DropdownMenuItem key={event.id}>
                      {event.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </>
        )}
        {studentRow.coordinatorForEvents!.length > 0 && (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Coordinator for</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {studentRow.coordinatorForEvents?.map((event) => (
                    <DropdownMenuItem key={event.id}>
                      {event.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </>
        )}
        {studentRow.eligibleEvents!.length > 0 && (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Eligible Override</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {studentRow.eligibleEvents?.map((event) => (
                    <DropdownMenuItem key={event.id}>
                      {event.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </>
        )}
        {studentRow.ineligibleEvents!.length > 0 && (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Ineligible Override
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {studentRow.ineligibleEvents?.map((event) => (
                    <DropdownMenuItem key={event.id}>
                      {event.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </>
        )}

        <DropdownMenuSeparator />
        <DeleteDialog
          trigger={
            <DropdownMenuItem className='text-destructive'>
              Delete
            </DropdownMenuItem>
          }
          itemId={student._id as Id<'students'>}
          itemType='student'
          itemName={student.userName}
        />
      </DropdownMenuContent>
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent
            className='max-w-[90%] lg:max-w-[50%] max-h-[80vh] rounded overflow-scroll no-scrollbar'
            aria-describedby={undefined}
          >
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>
                You are editing <strong>{student.userName}</strong>. Please
                update the details below and do not edit unnecessarily or with
                incorrect information. The fields at the end control whether
                student has completed their registration and whether they are
                deleted from the database, respectively; Only edit those fields
                if you know what you are doing.
              </DialogDescription>
            </DialogHeader>
            <EditStudentForm student={student} onClose={closeModal} />
          </DialogContent>
        </Dialog>
      )}
    </DropdownMenu>
  )
}
