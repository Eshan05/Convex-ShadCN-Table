'use client'

import { serverAction } from '@/app/auth/actions/server-action-signin'
import LinesLoader from '@/components/linesLoader'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Progress } from '@/components/ui/progress'
import { api } from '@/convex/_generated/api'
import { SecondFData } from '@/types/form'
import { useAuthActions } from '@convex-dev/auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from 'convex/react'
import dynamic from 'next/dynamic'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import LoginDialog from './login'
import { formSchema } from './schema'
import SecondForm from './second-form'

// const DISABLE_AUTH = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'
const DISABLE_AUTH = false

const FirstForm = dynamic(() => import('./first-form'), {
  ssr: false,
  loading: () => <LinesLoader />,
})

export default function DraftForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      phoneNumber: undefined,
      batchYear: undefined,
      prn: '',
      department: 'COMP',
      cgpa: undefined,
      backlogs: undefined,
      isPlaced: false,
      optedForHigherStudy: false,
      isInterestedInPlacements: false,
    },
  })

  type ActionResponse = { success: boolean; message: string }
  const initialState: ActionResponse = { success: false, message: '' }
  const [state, action, isPending] = React.useActionState(
    serverAction,
    initialState
  )

  return (
    <main className='p-4 flex flex-col gap-4 mx-auto max-w-4xl lg:w-3xl min-h-screen items-center justify-center'>
      <Form {...form}>
        <form
          action={action}
          className='flex flex-col p-2 md:p-5 w-full mx-auto rounded-md gap-2 border items-center shadow-lg'
        >
          <MultiStepViewer form={form} />
        </form>
      </Form>
      <LoginDialog />
    </main>
  )
}
export function MultiStepViewer({
  form,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>
}) {
  const { signIn } = useAuthActions()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [hasSignedUp, setHasSignedUp] = useState(
    searchParams.get('step') === '2'
  )

  const updateStepParam = (step: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('step', step.toString())
    router.replace(`${pathname}?${params.toString()}`)
  }

  const stepFormElements: {
    [key: number]: React.ReactElement | undefined
  } = {
    1: <FirstForm form={form} />, // Does mail and password and creates account and saves into users table
    // Second one stores in students table
    ...(hasSignedUp && {
      2: <SecondForm form={form} />,
    }),
  }

  const steps = Object.keys(stepFormElements).map(Number)
  React.useEffect(() => {
    const step = searchParams.get('step')
    if (step === '2' && !hasSignedUp) {
      router.replace(`${pathname}?step=1`)
    }
  }, [searchParams, hasSignedUp, router, pathname])

  const { currentStep, isLastStep, goToNext, goToPrevious } = useMultiStepForm({
    initialSteps: steps,

    onStepValidation: async (step) => {
      try {
        if (step === 1) {
          const step1DataArray = form.getValues(['email', 'password'])
          const step1Data = {
            email: step1DataArray[0],
            password: step1DataArray[1],
          }
          formSchema.pick({ email: true, password: true }).parse(step1Data)
          return true
        } else if (step === 2) {
          const step2DataArray = form.getValues([
            'first_name',
            'middle_name',
            'last_name',
            'phoneNumber',
            'batchYear',
            'prn',
            'department',
            'cgpa',
            'backlogs',
            'isPlaced',
            'isInterestedInPlacements',
          ])
          const step2Data: SecondFData = {
            first_name: step2DataArray[0],
            middle_name: step2DataArray[1],
            last_name: step2DataArray[2],
            phoneNumber: Number(step2DataArray[3]),
            batchYear: Number(step2DataArray[4]),
            prn: step2DataArray[5],
            department: step2DataArray[6],
            cgpa: Number(step2DataArray[7]),
            backlogs: Number(step2DataArray[8]),
            isPlaced: false,
            optedForHigherStudy: step2DataArray[9],
            isInterestedInPlacements: step2DataArray[10],
          }
          formSchema.omit({ email: true, password: true }).parse(step2Data)
          return true
        }
        return true
      } catch (error) {
        console.error('Validation error:', error)
        return false
      }
    },
  })
  const current = stepFormElements[currentStep]

  React.useEffect(() => {
    //? Including updateStepParam causing infinite rerenders
    //! But does not work without it
    updateStepParam(currentStep)
  }, [currentStep])

  const {
    formState: { isSubmitting },
  } = form
  const handleNext = async () => {
    if (currentStep === 1 && !hasSignedUp) {
      const step1Data = form.getValues(['email', 'password'])
      const data = new FormData()
      data.append('email', step1Data[0] || '')
      data.append('password', step1Data[1] || '')
      data.append('flow', 'signUp')

      try {
        if (DISABLE_AUTH) {
          setHasSignedUp(true)
          updateStepParam(2)
          toast.success('Account created successfully!!!')
        } else {
          await signIn('password', data)
          toast.success('Account created successfully.')
          data.set('flow', 'signIn')
          try {
            await signIn('password', data)
            setHasSignedUp(true)
            updateStepParam(2)
            // console.log('GG')
          } catch (signInError: unknown) {
            console.error('Sign-in error:', signInError)
          }
        }
      } catch (error: unknown) {
        toast.error('Account creation failed')
        console.error('Sign-up error:', error)
        return
      }
    }
    goToNext()
  }

  const createStudent = useMutation(api.students.createStudent)

  return (
    <div className='flex flex-col gap-2 pt-3'>
      <div className='flex flex-col gap-2'>{current}</div>
      <footer className='flex justify-between gap-2 p-1 items-center'>
        <section className='flex items-center gap-2 w-full pt-3'>
          <Button variant='outline' onClick={goToPrevious} type='button'>
            Previous
          </Button>
          {currentStep === 2 ? (
            <Button
              size='sm'
              type='submit'
              onClick={async () => {
                try {
                  const values = form.getValues()
                  await createStudent({
                    data: {
                      firstName: values.first_name,
                      middleName: values.middle_name,
                      lastName: values.last_name,
                      phoneNumber: values.phoneNumber,
                      gender: values.gender,
                      batchYear: values.batchYear,
                      prn: values.prn,
                      department: values.department,
                      cgpa: values.cgpa,
                      backlogs: values.backlogs,
                      isPlaced: values.isPlaced,
                      // @ts-ignore
                      isBlacklisted: values.isBlacklisted ?? false,
                      isInterestedInPlacements: values.isInterestedInPlacements,
                      optedForHigherStudy: values.optedForHigherStudy,
                    },
                  })
                  toast.success('Profile completed!')
                  router.push('/student')
                } catch (error) {
                  // console.log(error)
                  toast.error('Failed to save profile')
                }
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          ) : (
            <Button
              type='button'
              variant={'outline'}
              onClick={handleNext}
              // disabled={true}
            >
              Next
            </Button>
          )}
        </section>
        <aside className='flex flex-col gap-1 w-full mt-2'>
          <Progress value={((currentStep - 1) / (steps.length - 1)) * 100} />
          <span className='font-mono text-xs ml-auto'>
            {' '}
            Step {currentStep} / {steps.length}{' '}
          </span>
        </aside>
      </footer>
    </div>
  )
}

type UseFormStepsProps = {
  initialSteps: number[]
  onStepValidation?: (step: number) => Promise<boolean> | boolean
}

export type UseMultiFormStepsReturn = {
  steps: number[]
  currentStep: number
  currentStepData: number
  progress: number
  isFirstStep: boolean
  isLastStep: boolean
  goToNext: () => Promise<boolean>
  goToPrevious: () => void
}

export function useMultiStepForm({
  initialSteps,
  onStepValidation,
}: UseFormStepsProps): UseMultiFormStepsReturn {
  const steps = initialSteps
  const [currentStep, setCurrentStep] = useState(
    Number(useSearchParams().get('step')) || 1
  )
  const goToNext = useCallback(async () => {
    // const currentStepData = initialSteps[currentStep - 1];

    if (onStepValidation) {
      const isValid = await onStepValidation(currentStep)
      if (!isValid) return false
    }

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1)
      return true
    }
    return false
  }, [currentStep, steps, onStepValidation])

  const goToPrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  return {
    steps,
    currentStep,
    currentStepData: steps[currentStep - 1],
    progress: (currentStep / steps.length) * 100,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === steps.length,
    goToNext,
    goToPrevious,
  }
}
