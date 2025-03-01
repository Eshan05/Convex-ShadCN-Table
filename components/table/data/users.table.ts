import { z } from 'zod'

export const userSchema = z.object({
  _creationTime: z.number(),
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerificationTime: z.optional(z.number()),
  roles: z.optional(z.array(z.enum(['student', 'coordinator', 'admin']))),
  isActive: z.optional(z.boolean()).default(true),
})

export type zUser = z.infer<typeof userSchema>
