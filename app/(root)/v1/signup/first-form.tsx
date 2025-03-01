import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React from 'react'
import { IoInformationOutline } from 'react-icons/io5'
import { PasswordCompare } from './password-compare'
import { useFormContext } from 'react-hook-form'

interface FirstFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
}

const FirstForm: React.FC<FirstFormProps> = ({ form }) => {
  return (
    <article className='max-w-sm sm:max-md lg:w-lg p-1 flex flex-col items-center space-y-4'>
      <header className='flex flex-col gap-1 my-2 max-w-sm'>
        <h2 className='shadow-heading text-center text-5xl'>Register</h2>
        <p className='text-muted-foreground text-sm mb-6 text-left'>
          Enter your email and password of choice to sign up, note that, you
          will not be able to change your email address later. If you are not
          able to sign up please{' '}
          <Button variant='link' size='none'>
            contact us
          </Button>
          . Ensure to do both parts together, we do not support drafts. <br />
          <Link href='/auth/sign-in' className='underline'>
            Already have an account?
          </Link>
        </p>
      </header>
      <FormField
        control={form.control}
        name='email'
        render={({ field }) => (
          <FormItem className=''>
            <FormLabel className=''>
              <header className='px-1 flex items-start gap-2 font-medium'>
                <>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button size={'sm-icon'} variant='outline' type='button'>
                        <IoInformationOutline className='hover:text-black dark:hover:text-white text-muted-foreground' />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className='w-72 m-2 leading-normal bg-[#fff2] dark:bg-[#2224] backdrop-blur-lg'>
                      <div className='space-y-1 flex flex-col'>
                        <h4 className='font-semibold text-base'>Email</h4>
                        <p className='text-[.75rem] font-normal'>
                          Please enter the professional email address you used
                          on the Pod app. You will not be able to change this
                          later.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <span className='text-base -mt-0.5'>Email</span>
                </>
              </header>
            </FormLabel>
            <FormControl>
              <Input
                placeholder='Enter your email'
                className='w-80'
                tabIndex={1}
                name='email'
                type={'email'}
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
        name='password'
        render={({ field }) => (
          <FormItem className=''>
            {/* <FormLabel className='text-base'>Password</FormLabel> */}
            <FormControl>
              {/* <PasswordInput form={form} field={field} /> */}
              <PasswordCompare
                form={form}
                className='w-80 mx-auto flex flex-col items-start justify-start gap-4'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </article>
  )
}

export default FirstForm
