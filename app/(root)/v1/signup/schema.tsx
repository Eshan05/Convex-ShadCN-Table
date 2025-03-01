import z from 'zod'

export interface ActionResponse<T = Record<string, unknown>> {
  success: boolean
  message: string
  errors?: {
    [K in keyof T]?: string[]
  }
  inputs?: T
}

export const formSchema = z.object({
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(8)),
  confirmPassword: z.optional(z.string().min(8)),
  gender: z.enum(['MALE', 'FEMALE']),
  first_name: z.string(),
  middle_name: z.string(),
  last_name: z.string(),
  phoneNumber: z.number(),
  batchYear: z.number(),
  prn: z.string(),
  department: z.enum(['COMP', 'IT', 'ENTC', 'CIVIL', 'MECH']),
  cgpa: z.number(),
  backlogs: z.number(),
  isPlaced: z.boolean().default(false),
  optedForHigherStudy: z.boolean().default(false),
  isInterestedInPlacements: z.boolean().default(true),
})

// https://forum.codewithmosh.com/t/password-complexity-for-zod/23622
