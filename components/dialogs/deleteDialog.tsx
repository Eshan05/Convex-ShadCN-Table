'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import React from 'react'
import { toast } from 'sonner'

interface DeleteDialogProps {
  trigger: React.ReactNode | boolean
  onUpdate?: () => void
  itemId: Id<'students' | 'events'>
  itemType: 'student' | 'event' | 'attendance'
  itemName?: string
}

export function DeleteDialog({
  trigger,
  itemId,
  itemType,
  itemName,
}: DeleteDialogProps) {
  const [open, setOpen] = React.useState(false)

  const archiveStudent = useMutation(api.students.archiveStudent)
  const deleteEvent = useMutation(api.events.deleteEvent)
  // const deleteAttendance = useMutation(api.attendance.deleteAttendance)

  const handleDelete = async () => {
    try {
      if (itemType === 'student') {
        await archiveStudent({ id: itemId as Id<'students'> })
        toast.success('Student archived successfully.')
      } else if (itemType === 'event') {
        await deleteEvent({ id: itemId as Id<'events'> })
        toast.success('Event deleted successfully.')
      }
      // } else if (itemType === 'attendance') {
      //   await deleteAttendance({ id: itemId as Id<'attendance'> })
      //   toast.success('Attendance deleted successfully.')
      // }

      setOpen(false) // Close the dialog on success
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error(`Failed to delete ${itemType}. See console for details.`)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to Delete this {itemType}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {itemName && <div>Item Name: {itemName}</div>}
            This action cannot be undone.
            {itemType === 'student'
              ? '  This will archive the student.'
              : itemType === 'event'
                ? '  This will set the event as deleted.'
                : 'This will delete the attendance record.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
