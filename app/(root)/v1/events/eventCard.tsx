'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  BookXIcon,
  CalendarDaysIcon,
  ClockIcon,
  LockIcon,
  LockOpen,
  PencilIcon,
  School2Icon,
  ShieldCheckIcon,
  Trash2Icon,
  User2Icon,
} from 'lucide-react'
import { BsFileText } from 'react-icons/bs'
import { IoLocationOutline } from 'react-icons/io5'
import { PiExamLight } from 'react-icons/pi'
import { depToString } from '../create/save'
import { TransformedEvent } from './page'
import { convertISOToIST } from '@/lib/utils'
import { DeleteDialog } from '@/components/dialogs/deleteDialog'
import Link from 'next/link'

interface EventCardProps {
  event: TransformedEvent
  onEdit: () => void
  onDelete?: () => void
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  const getStatusCircleColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'scheduled':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-blue-500'
      case 'draft':
        return 'bg-gray-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-200'
    }
  }
  return (
    <Card className='group'>
      <CardHeader>
        <>
          <div className='flex items-center justify-between gap-1'>
            <section className='flex items-center gap-2'>
              <Badge className='flex items-center gap-2' variant={'outline'}>
                <span
                  className={`inline-block w-2 h-2 rounded-full ${getStatusCircleColor(event.status)}`}
                ></span>
                <span>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </Badge>
              <Badge className='flex items-center gap-2' variant={'secondary'}>
                <User2Icon />
                <span>{event?.totalParticipants}</span>
              </Badge>
              <Badge className='flex items-center gap-2'>
                {event.isPublic ? (
                  <>
                    <LockOpen />
                    <span className='hidden sm:inline'>Public</span>
                  </>
                ) : (
                  <>
                    <LockIcon />
                    <span className='hidden sm:inline'>Private</span>
                  </>
                )}
              </Badge>
            </section>
            <aside className='font-mono text-xs py-0.5 px-2 border rounded overflow-x-auto no-scrollbar max-w-12 md:max-w-24'>
              <span className=''>{event._id}</span>
            </aside>
          </div>
          <CardTitle className='flex items-start gap-2'>
            <h3 className='text-2xl'>{event.name}</h3>
          </CardTitle>
        </>
        <CardDescription className='flex flex-col items-start'>
          <div className='flex items-center gap-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <BsFileText className='w-4 h-4' />
              </TooltipTrigger>
              <TooltipContent>Event Description</TooltipContent>
            </Tooltip>
            <ScrollArea className='max-h-16 h-max w-full rounded-md'>
              <p className='p-1 rounded inline-block w-full !max-h-16 overflow-scroll no-scrollbar'>
                {event.description}
              </p>
            </ScrollArea>
          </div>
          <div className='flex items-center gap-x-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <IoLocationOutline className='w-4 h-4' />
              </TooltipTrigger>
              <TooltipContent>Event Location</TooltipContent>
            </Tooltip>
            <ScrollArea className='max-h-12 w-full rounded-md'>
              <p className='p-1 rounded text-sm no-scrollbar inline-block w-full'>
                {event.location}
              </p>
            </ScrollArea>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-col flex gap-2'>
        <div className='flex items-center gap-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <ShieldCheckIcon className='w-4 h-4' />
            </TooltipTrigger>
            <TooltipContent>Coordinators</TooltipContent>
          </Tooltip>
          <section className='flex gap-1 flex-wrap'>
            {event.coordinatorNames.map((name: string) => {
              return (
                <Badge key={name} variant={'secondary'}>
                  {name}
                </Badge>
              )
            })}
          </section>
        </div>
        <div className='flex items-center gap-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <School2Icon className='w-4 h-4' />
            </TooltipTrigger>
            <TooltipContent>Departments and Batches</TooltipContent>
          </Tooltip>
          <section className='flex gap-1 flex-wrap'>
            {event?.eligibilityCriteria?.allowedDepartments!.map(
              (name: string) => {
                return (
                  <Badge key={name} variant={'secondary'}>
                    {depToString(name)}
                  </Badge>
                )
              }
            )}
            {event?.eligibilityCriteria?.allowedBatches!.map((name: number) => {
              return (
                <Badge key={name} variant={'secondary'}>
                  {name}
                </Badge>
              )
            })}
          </section>
        </div>
        <section className='w-full flex justify-between items-end gap-1 mt-2'>
          <main className='flex flex-col gap-1 text-xs'>
            <div className='flex items-center gap-2'>
              <BookXIcon className='w-4 h-4' />
              <p className=' inline-block text-muted-foreground'>
                Max Backlogs{' '}
                <strong>{event.eligibilityCriteria.maxBacklogs}</strong>
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <PiExamLight className='w-4 h-4' />
              <span className='text-muted-foreground'>
                Required CGPA{' '}
                <strong>{event.eligibilityCriteria.requiredCGPA}</strong>
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <ClockIcon className='w-4 h-4' />
              <span className='text-muted-foreground'>
                Arriving Time <strong>{event.arrivingTime}</strong>
              </span>
            </div>
          </main>
          <Link
            href={`/admin/attendance/${event._id}`}
            className='flex flex-col gap-2'
          >
            <Button variant={'outline'} className='text-sm'>
              Attendees
            </Button>
          </Link>
        </section>
        <div className='flex items-center justify-between gap-1'>
          <aside className='flex items-center gap-2'>
            <section className='flex items-center gap-2'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CalendarDaysIcon className='w-4 h-4' />
                </TooltipTrigger>
                <TooltipContent>Start and End Time</TooltipContent>
              </Tooltip>
              <main className='flex flex-col gap-0.5 font-mono text-[.65rem] p-0.5 text-muted-foreground'>
                <span>
                  {convertISOToIST(event.startDateTime).slice(0, -2) +
                    convertISOToIST(event.startDateTime)
                      .toUpperCase()
                      .slice(-2)}
                </span>
                <span>
                  {convertISOToIST(event.endDateTime).slice(0, -2) +
                    convertISOToIST(event.endDateTime).toUpperCase().slice(-2)}
                </span>
              </main>
            </section>
          </aside>
          <main className='flex items-center p-1 justify-end gap-2'>
            <Button variant={'outline'} size={'icon'} onClick={onEdit}>
              <PencilIcon className='text-yellow-600 dark:text-yellow-400' />
            </Button>
            <DeleteDialog
              trigger={
                <Button variant={'outline'} size={'icon'} onClick={onDelete}>
                  <Trash2Icon className='text-red-400' />
                </Button>
              }
              itemId={event._id}
              itemType='event'
            />
          </main>
        </div>
      </CardContent>
    </Card>
  )
}

export default EventCard
