'use client'

import { DateTimePickerForm } from '@/components/calendar'
import { MultiSelect } from '@/components/multi-select'
import { AutosizeTextarea } from '@/components/ui/autoresize-textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from 'convex/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { EventFormSchema, DepList, BatchList } from './save'
import { EventInterface } from '@/types/tables'

type EventFormValues = z.infer<typeof EventFormSchema>
interface EventFormProps {
  lastEdited?: string
  passedData?: EventInterface
  onUpdate?: () => void
}

export default function EventForm({
  lastEdited,
  passedData,
  onUpdate,
}: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: passedData
      ? {
          ...passedData,
          startDateTime: new Date(passedData.startDateTime),
          endDateTime: new Date(passedData.endDateTime),
          coordinatorIds: passedData.coordinatorIds.map((coordinator) =>
            typeof coordinator === 'string' ? coordinator : coordinator.id
          ),
          eligibilityCriteria: {
            ...passedData.eligibilityCriteria,
          },
        }
      : {
          isPublic: true,
          totalParticipants: 0,
          updatedAt: Date.now(),
          isDeleted: false,
          status: 'draft',
          coordinatorIds: [],
          eligibilityCriteria: {
            requiredCGPA: undefined,
            maxBacklogs: undefined,
            allowedDepartments: [],
            allowedBatches: [2026],
          },
        },
  })

  const updateEventMutation = useMutation(api.events.updateEvent)
  const createEventMutation = useMutation(api.events.createEvent)
  async function onSubmit(data: EventFormValues) {
    try {
      const coordinatorIdsForConvex = data.coordinatorIds.map((id) => ({
        id: id as Id<'users'>,
      }))

      const dataForConvex = {
        ...data,
        coordinatorIds: coordinatorIdsForConvex,
        startDateTime: data.startDateTime.toISOString(),
        endDateTime: data.endDateTime.toISOString(),
        eligibilityCriteria: {
          ...data.eligibilityCriteria,
          allowedDepartments: data.eligibilityCriteria.allowedDepartments.map(
            (department) => {
              switch (department) {
                case 'COMP':
                case 'IT':
                case 'ENTC':
                case 'CIVIL':
                case 'MECH':
                  return department
                default:
                  throw new Error(`Invalid department: ${department}`)
              }
            }
          ),
        },
      }

      // console.log(dataForConvex)
      if (passedData) {
        try {
          const updateData = {
            _id: passedData._id,
            ...dataForConvex,
          }
          await updateEventMutation(updateData)
          toast.success('Event updated successfully!')
        } catch (error) {
          console.error('Error updating event:', error)
          toast.error('Error updating event')
        }
      } else {
        const newEventId = await createEventMutation(dataForConvex)
        toast.success('Event created successfully!' + newEventId)
      }
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error('Error creating event')
    }
  }

  const coordinators = useQuery(api.coordinators.getCoordinators)
  // console.log(coordinators)
  const isLoadingCoordinators = coordinators === undefined
  const coordinatorsOptions = React.useMemo(() => {
    return coordinators?.map((user) => ({
      value: user._id,
      label: user.name || user.email,
    }))
  }, [coordinators])

  React.useEffect(() => {
    if (passedData) {
      form.reset({
        ...passedData,
        startDateTime: new Date(passedData.startDateTime),
        endDateTime: new Date(passedData.endDateTime),
        coordinatorIds: passedData.coordinatorIds.map((coordinator) =>
          typeof coordinator === 'string' ? coordinator : coordinator.id
        ),
      })
    }
  }, [passedData, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 p-4'>
        <section className='grid sm:grid-cols-2 grid-cols-1 gap-4 items-start justify-around w-full'>
          <div className='space-y-2 flex flex-col'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Event Name</FormLabel> */}
                  <FormControl>
                    <Input placeholder='Event Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Location</FormLabel> */}
                  <FormControl>
                    <Input placeholder='Event Location' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Status</FormLabel> */}
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='draft'>Draft</SelectItem>
                      <SelectItem value='scheduled'>Scheduled</SelectItem>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='completed'>Completed</SelectItem>
                      <SelectItem value='cancelled'>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='arrivingTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arriving Time</FormLabel>
                  <FormControl>
                    <Input placeholder='Arriving Time' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Description</FormLabel> */}
                <FormControl>
                  <AutosizeTextarea
                    placeholder='Describe the event...'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className='grid lg:grid-cols-2 grid-cols-1 gap-4 items-center justify-center p-1'>
          <FormField
            control={form.control}
            name='coordinatorIds'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coordinators</FormLabel>
                <FormDescription>
                  Please select all the coordinators that are or will be present
                  at the event. You can see the names of coordinators in the
                  dropdown below. To unselect coordinators click again and
                  unselect from the dropdown.
                </FormDescription>
                <FormControl>
                  <MultiSelect
                    name='coordinatorIds'
                    options={
                      coordinatorsOptions?.length ? coordinatorsOptions : []
                    }
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder='Select coordinators'
                    disabled={isLoadingCoordinators}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <aside className='flex gap-4 items-center justify-center p-1'>
            <FormField
              control={form.control}
              name='isPublic'
              render={({ field }) => (
                <FormItem className='flex flex-col rounded-md border p-3'>
                  <FormControl>
                    <div className='flex items-center gap-2'>
                      <Checkbox
                        checked={field.value}
                        name='isPublic'
                        onCheckedChange={field.onChange}
                      />
                      <FormLabel>Public</FormLabel>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Make this event visible to students.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isDeleted'
              render={({ field }) => (
                <FormItem className='flex flex-col rounded-md border p-3'>
                  <FormControl>
                    <div className='flex items-center gap-2'>
                      <Checkbox
                        name='isDeleted'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FormLabel className=''>Archive</FormLabel>
                    </div>
                  </FormControl>
                  <FormDescription className='mx-1'>
                    Archive this event.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </aside>
        </section>

        <section className='grid lg:grid-cols-2 grid-cols-1 gap-4 items-center justify-center p-1'>
          <FormField
            control={form.control}
            name='startDateTime'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Start Date</FormLabel>
                <DateTimePickerForm
                  setValue={field.onChange}
                  fieldValue={field.value}
                />
                <FormDescription>
                  The start date and time of the event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='endDateTime'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel className='lg:text-right'>End Date</FormLabel>
                <DateTimePickerForm
                  setValue={field.onChange}
                  fieldValue={field.value}
                />
                <FormDescription className='lg:text-right'>
                  The end date and time of the event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <div className='flex flex-col gap-4 items-center justify-center'>
          <section className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='eligibilityCriteria.requiredCGPA'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required CGPA</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='7.5' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='eligibilityCriteria.maxBacklogs'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Backlogs</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='2' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
          <section className='grid lg:grid-cols-2 grid-cols-1 items-start gap-4'>
            <FormField
              control={form.control}
              name='eligibilityCriteria.allowedDepartments'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowed Departments</FormLabel>
                  <FormControl>
                    <MultiSelect
                      name='eligibilityCriteria.allowedDepartments'
                      options={DepList}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder='Select departments'
                      maxCount={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='eligibilityCriteria.allowedBatches'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowed Batches</FormLabel>
                  <FormControl>
                    <MultiSelect
                      className=''
                      name='eligibilityCriteria.allowedBatches'
                      options={BatchList}
                      onValueChange={(value) =>
                        field.onChange(value.map(Number))
                      }
                      defaultValue={String(field.value).split(',')}
                      placeholder='Select batches'
                      maxCount={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='eligibilityCriteria.gender'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender Requirements</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select a gender' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='MALE'>Male Only</SelectItem>
                        <SelectItem value='FEMALE'>Female Only</SelectItem>
                        <SelectItem value='NONE'>No restrictions</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </section>
        </div>

        <Button type='submit'>
          {passedData ? 'Update Event' : 'Create Event'}
        </Button>
      </form>
    </Form>
  )
}
