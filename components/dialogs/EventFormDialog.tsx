// components/EventFormDialog.tsx
'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { EventInterface } from '@/types/tables'
import { Button } from '@/components/ui/button'
import React from 'react'
import EventForm from '@/app/(root)/v1/create/eventForm'

interface EventFormDialogProps {
  event?: EventInterface
  children: React.ReactNode
  onUpdate: () => void
}

export function EventFormDialog({
  event,
  children,
  onUpdate,
}: EventFormDialogProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create Event'}</DialogTitle>
        </DialogHeader>
        <EventForm
          passedData={event}
          onUpdate={() => {
            setOpen(false)
            onUpdate()
          }}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' type='button'>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
