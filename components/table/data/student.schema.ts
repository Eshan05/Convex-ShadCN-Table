import { z } from 'zod'
export const zDepEnum = z.enum(['COMP', 'IT', 'ENTC', 'CIVIL', 'MECH'])
export const zGenderEnum = z.enum(['MALE', 'FEMALE'])

export const studentSchema = z.object({
  userId: z.string(), // Relation
  _id: z.string(),
  userName: z.string(), // 'users' Table
  userEmail: z.string(), // 'users' Table
  userIsActive: z.optional(z.boolean()), // 'users' Table
  onBoarded: z.boolean(),
  number: z.string(),
  prn: z.string(),
  batchYear: z.number(), // Exactly 4 digits
  department: zDepEnum,
  cgpa: z.number(), // Max 10
  backlogs: z.number(), // Max 10
  gender: zGenderEnum, // Non-optional afterwards
  eligibilityOverrides: z.optional(
    z.object({
      // Need to convert all these
      isCoordinator: z.optional(z.array(z.object({ id: z.string() }))),
      eligibleEvents: z.optional(z.array(z.object({ id: z.string() }))),
      ineligibleEvents: z.optional(z.array(z.object({ id: z.string() }))),
    })
  ),
  eventsAttended: z.optional(z.array(z.object({ id: z.string() }))),
  isBlacklisted: z.optional(z.boolean()),
  isPlaced: z.boolean(),
  isArchived: z.optional(z.boolean()),
  isInterestedInPlacements: z.boolean(),
  optedForHigherStudy: z.boolean(),
  isEnrolled: z.optional(z.boolean()),
  enrollmentStatus: z.optional(
    z.union([
      z.literal('active'),
      z.literal('on_leave'),
      z.literal('graduated'),
      z.literal('suspended'),
    ])
  ),
})

export type Student = z.infer<typeof studentSchema>
