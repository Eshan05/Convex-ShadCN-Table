'use client'

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
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { MultiSelect } from '@/components/multi-select'
import { Checkbox } from '@/components/ui/checkbox'
import React from 'react'
import { studentSchema, zDepEnum } from '@/components/table/data/student.schema'
import { BatchList } from '../create/save'

const allDepartments = zDepEnum.options
const currentYear = new Date().getFullYear()

const EnrollmentList = [
  { value: 'active', label: 'Active' },
  { value: 'on_leave', label: 'On Leave' },
  { value: 'graduated', label: 'Graduated' },
  { value: 'suspended', label: 'Suspended' },
]

type StudentFormValues = z.infer<typeof studentSchema> & {
  userIsActive?: boolean
}

interface EditStudentFormProps {
  student: StudentFormValues
  onClose: () => void
}
interface EventInfo {
  id: Id<'events'>
  name: string
}

export function EditStudentForm({ student, onClose }: EditStudentFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const { transformedStudents, eventIdToName } = useQuery(
    api.students.getStudentsForTable
  ) || { transformedStudents: [], eventIdToName: {} }
  const [loading, setLoading] = React.useState(false)

  const updateStudent = useMutation(api.students.updateStudent)
  const updateUser = useMutation(api.users.updateUser)

  const defaultValues: Partial<StudentFormValues> = React.useMemo(
    () => ({
      ...student,
      eligibilityOverrides: student.eligibilityOverrides
        ? {
            isCoordinator: student.eligibilityOverrides.isCoordinator?.map(
              (event) => ({ id: event.id })
            ),
            eligibleEvents: student.eligibilityOverrides.eligibleEvents?.map(
              (event) => ({ id: event.id })
            ),
            ineligibleEvents:
              student.eligibilityOverrides.ineligibleEvents?.map((event) => ({
                id: event.id,
              })),
          }
        : undefined,
      eventsAttended: student.eventsAttended?.map((event) => ({
        id: event.id,
      })),
    }),
    [student]
  )

  const form = useForm<StudentFormValues>({
    // resolver: zodResolver(studentSchema),
    resolver: zodResolver(
      studentSchema.extend({
        userIsActive: z.optional(z.boolean()),
      })
    ),
    defaultValues,
    mode: 'onChange',
  })

  async function onSubmit(data: StudentFormValues) {
    // console.log(data)
    try {
      setIsLoading(true)
      const coordinatorIdsForConvex =
        data.eligibilityOverrides?.isCoordinator?.map((id) => ({
          id: id as unknown as Id<'events'>,
        })) || []
      const eligibleEventsForConvex =
        data.eligibilityOverrides?.eligibleEvents?.map((id) => ({
          id: id as unknown as Id<'events'>,
        })) || []
      const ineligibleEventsForConvex =
        data.eligibilityOverrides?.ineligibleEvents?.map((id) => ({
          id: id as unknown as Id<'events'>,
        })) || []
      const attendedEventsForConvex =
        data.eventsAttended?.map((id) => ({
          id: id as unknown as Id<'events'>,
        })) || []

      await updateStudent({
        id: student._id as Id<'students'>,
        // @ts-ignore Fuck this Id and string
        updates: {
          ...data,
          userName: undefined as unknown as string,
          userEmail: undefined as unknown as string,
          isActive: undefined as unknown as boolean,
          // Convert back to array
          eligibilityOverrides: data.eligibilityOverrides
            ? {
                isCoordinator: coordinatorIdsForConvex,
                eligibleEvents: eligibleEventsForConvex,
                ineligibleEvents: ineligibleEventsForConvex,
              }
            : undefined,
          eventsAttended: attendedEventsForConvex,
        },
      })

      await updateUser({
        id: student.userId as Id<'users'>,
        name: data.userName,
        email: data.userEmail,
        // isActive: data.userIsActive,
        isActive: true,
      })

      toast.success('Student updated successfully.')
      onClose()
    } catch (error) {
      console.error('Error updating student:', error)
      toast.error('Failed to update student.')
    } finally {
      setIsLoading(false)
    }
  }

  const eventOptions = React.useMemo(() => {
    return Object.entries(eventIdToName).map(([id, name]) => ({
      value: id,
      label: name,
    }))
  }, [eventIdToName])
  // console.log(eventOptions)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div className='grid md:grid-cols-3 grid-cols-2 w-full gap-2'>
          {/* <section className="flex flex-col gap-2 w-full"> */}
          <FormField
            control={form.control}
            name='userName'
            render={({ field }) => (
              <FormItem className='w-full'>
                {/* <FormLabel>Name</FormLabel> */}
                <FormControl>
                  <Input
                    placeholder='Full Name'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='number'
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Number</FormLabel> */}
                <FormControl>
                  <Input placeholder='Number' {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='userEmail'
            render={({ field }) => (
              <FormItem className='w-full'>
                {/* <FormLabel>Email</FormLabel> */}
                <FormControl>
                  <Input placeholder='Email' {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* </section> */}
          {/* <section className="flex flex-col gap-2 w-full"> */}
          <FormField
            control={form.control}
            name='department'
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Department</FormLabel> */}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a department' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allDepartments.map((dept: string) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='prn'
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>PRN</FormLabel> */}
                <FormControl>
                  <Input placeholder='PRN' {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='batchYear'
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Batch Year</FormLabel> */}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Batch year' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BatchList.map((batch) => (
                      <SelectItem key={batch.value} value={batch.value}>
                        {batch.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* </section> */}
        </div>
        <div className='flex items-center justify-between flex-nowrap w-full gap-2'>
          <FormField
            control={form.control}
            name='gender'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Gender' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='MALE'>Male</SelectItem>
                      <SelectItem value='FEMALE'>Female</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='cgpa'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>CGPA</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='CGPA'
                    {...field}
                    step='0.01'
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='backlogs'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Backlogs</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Backlogs'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Nested fields for eligibilityOverrides */}
        <div className='p-2 flex flex-col gap-4'>
          <h3 className='text-lg font-semibold'>Eligibility Overrides</h3>
          <FormField
            control={form.control}
            name='eligibilityOverrides.isCoordinator'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coordinator For</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={eventOptions}
                    onValueChange={field.onChange}
                    defaultValue={
                      field?.value?.map((option) => option.id) ?? []
                    }
                    placeholder='Select Events'
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='eligibilityOverrides.eligibleEvents'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Eligible For Events</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={eventOptions}
                    onValueChange={field.onChange}
                    defaultValue={
                      field?.value?.map((option) => option.id) ?? []
                    }
                    placeholder='Select Events'
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='eligibilityOverrides.ineligibleEvents'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ineligible For Events</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={eventOptions}
                    onValueChange={field.onChange}
                    defaultValue={
                      field?.value?.map((option) => option.id) ?? []
                    }
                    placeholder='Select Events'
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='eventsAttended'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Events attended</FormLabel>
              <FormControl>
                <MultiSelect
                  options={eventOptions}
                  onValueChange={field.onChange}
                  defaultValue={field?.value?.map((option) => option.id) ?? []}
                  placeholder='Select Events'
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Boolean fields */}
        <div className='grid grid-cols-2 gap-2 w-full'>
          <FormField
            control={form.control}
            name='isBlacklisted'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                <FormControl>
                  <Checkbox
                    checked={field?.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>Blacklisted</FormLabel>
                  <FormDescription>Blacklisted from placements</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='isPlaced'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>Placed</FormLabel>
                  <FormDescription>Is placed already</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='isInterestedInPlacements'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>Interested in Placements</FormLabel>
                  <FormDescription>Is interested in placements</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='optedForHigherStudy'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>Opted for Higher Study</FormLabel>
                  <FormDescription>
                    Has opted for higher studies.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='enrollmentStatus'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enrollment Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select enrollment status' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EnrollmentList.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grid grid-cols-2 gap-2 w-full'>
          <FormField
            control={form.control}
            name='onBoarded'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>Onboarded</FormLabel>
                  <FormDescription>Is onboarded</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='isArchived'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>Active</FormLabel>
                  <FormDescription>Is active</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type='submit' disabled={isLoading}>
          Update Student
        </Button>
      </form>
    </Form>
  )
}
