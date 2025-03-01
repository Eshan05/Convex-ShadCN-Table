'use client'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SecondFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
}

const SecondForm: React.FC<SecondFormProps> = ({ form }) => {
  return (
    <article className='max-w-sm md:w-md p-1 flex flex-col items-center space-y-4'>
      <header className='flex flex-col gap-1 my-2'>
        <h2 className='shadow-heading text-center text-5xl'>
          Personal Details
        </h2>
        <p className='text-muted-foreground text-sm mb-6 text-left'>
          Please enter all your details and ensure that it is correct. We will
          be verifying your details later. If there are any errors in your
          details or you are not able to sign up, please{' '}
          <Button variant='link' size='none'>
            contact us
          </Button>
          .
        </p>
      </header>
      <div className='flex items-center justify-between flex-wrap md:flex-nowrap w-full gap-2'>
        <FormField
          control={form.control}
          name='first_name'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='First Name'
                  name='first_name'
                  type={'text'}
                  value={field.value || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    field.onChange(val)
                  }}
                  min={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='middle_name'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel className='md:text-center'>Middle Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Middle Name'
                  name='middle_name'
                  type={'text'}
                  value={field.value || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    field.onChange(val)
                  }}
                  min={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='last_name'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel className='md:text-right'>Last Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Last Name'
                  name='last_name'
                  min={2}
                  type={'text'}
                  value={field.value || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    field.onChange(val)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='grid items-center grid-cols-3 w-full gap-2'>
        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder='Phone Number'
                  name='phoneNumber'
                  type='number'
                  value={
                    field.value === null || field.value === undefined
                      ? ''
                      : field.value
                  }
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    field.onChange(val)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='batchYear'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel className='text-center'>Batch Year</FormLabel>
              <FormControl>
                <Input
                  placeholder='EX: 2027'
                  name='batchYear'
                  type={'number'}
                  max={new Date().getFullYear() + 5}
                  value={
                    field.value === null || field.value === undefined
                      ? ''
                      : field.value
                  }
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    field.onChange(val)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='gender'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-right'>Gender</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a gender' />
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
      </div>
      <div className='flex items-center justify-between w-full gap-2'>
        <FormField
          control={form.control}
          name='prn'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>PRN</FormLabel>
              <FormControl>
                <Input
                  placeholder='PRN'
                  name='prn'
                  type='text'
                  value={field.value || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    field.onChange(val)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='department'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel className='text-right'>Department</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a department' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='COMP'>Computer Engineering</SelectItem>
                    <SelectItem value='IT'>Information Technology</SelectItem>
                    <SelectItem value='ENTC'>
                      Electronics and Telecommunication
                    </SelectItem>
                    <SelectItem value='MECH'>Mechanical Engineering</SelectItem>
                    <SelectItem value='CIVIL'>Civil Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='flex items-center justify-between w-full gap-2'>
        <FormField
          control={form.control}
          name='cgpa'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>CGPA</FormLabel>
              <FormControl>
                <Input
                  placeholder='CGPA'
                  name='cgpa'
                  max={10}
                  type={'number'}
                  value={
                    field.value === null || field.value === undefined
                      ? ''
                      : field.value
                  }
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    field.onChange(val)
                  }}
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
              <FormLabel className='text-right'>Backlogs</FormLabel>
              <FormControl>
                <Input
                  placeholder='Active only'
                  name='backlogs'
                  max={10}
                  type={'number'}
                  value={
                    field.value === null || field.value === undefined
                      ? ''
                      : field.value
                  }
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    field.onChange(val)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='flex items-start flex-col gap-2'>
        <FormField
          control={form.control}
          name='optedForHigherStudy'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start gap-2 p-1'>
              <FormControl>
                <Checkbox
                  name='optedForHigherStudy'
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Have you opted for higher studies?</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='isInterestedInPlacements'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start gap-2 p-1'>
              <FormControl>
                <Checkbox
                  defaultChecked={true}
                  name='isInterestedInPlacements'
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Are you interested in campus placements?</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </article>
  )
}

export default SecondForm
