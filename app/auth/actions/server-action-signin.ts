'use server'

import { ActionResponse, formSchema } from '@/app/(root)/v1/signup/schema'

export const serverAction = async (
  prevState: ActionResponse | null,
  data: FormData
): Promise<ActionResponse> => {
  const entries = data.entries()
  // console.log('FormData being sent:', Array.from(data.entries()))
  const rawData: Record<string, string | number | boolean> = Object.fromEntries(
    entries
  ) as Record<string, string | number | boolean>

  for (const key in rawData) {
    if (rawData[key] === 'on') {
      rawData[key] = true
    }
  }

  const convertToNumber = (value: string | number): number | string => {
    if (typeof value === 'string' && !isNaN(Number(value))) return Number(value)
    return value
  }

  const parsedData = Object.fromEntries(
    // @ts-ignore
    Object.entries(rawData).map(([key, value]) => [key, convertToNumber(value)])
  ) as Record<string, string | number | boolean>

  const validatedData = formSchema.safeParse(parsedData)

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Invalid data',
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData,
    }
  } else {
  }
  return {
    success: true,
    message: 'Data saved',
  }
}
