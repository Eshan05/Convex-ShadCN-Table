import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { authTables } from '@convex-dev/auth/server'

export default defineSchema({
  ...authTables,
  users: defineTable({
    roles: v.optional(
      v.array(
        v.union(
          v.literal('student'),
          v.literal('coordinator'),
          v.literal('admin')
        )
      )
    ),
    isActive: v.optional(v.boolean()),
    name: v.optional(v.string()),
    email: v.string(),
    emailVerificationTime: v.optional(v.number()),
  })
    .index('by_roles', ['roles'])
    .index('email', ['email'])
    .index('by_name', ['name']),

  students: defineTable({
    userId: v.id('users'),
    onBoarded: v.boolean(),
    number: v.string(), // Maybe add validation of ten digits
    prn: v.string(), // Letter at end
    batchYear: v.number(), // Exactly 4 digits
    department: v.union(
      v.literal('COMP'),
      v.literal('IT'),
      v.literal('ENTC'),
      v.literal('CIVIL'),
      v.literal('MECH')
    ),
    cgpa: v.number(), // Max 10
    backlogs: v.number(), // Max 10
    gender: v.union(v.literal('MALE'), v.literal('FEMALE')),
    eligibilityOverrides: v.optional(
      v.object({
        isCoordinator: v.array(v.object({ id: v.id('events') })),
        eligibleEvents: v.array(v.object({ id: v.id('events') })),
        ineligibleEvents: v.array(v.object({ id: v.id('events') })),
      })
    ),
    isBlacklisted: v.boolean(),
    isInterestedInPlacements: v.boolean(),
    isPlaced: v.boolean(),
    optedForHigherStudy: v.boolean(),
    eventsAttended: v.optional(v.array(v.object({ id: v.id('events') }))),
    isEnrolled: v.optional(v.boolean()),
    enrollmentStatus: v.optional(
      v.union(
        v.literal('active'),
        v.literal('on_leave'),
        v.literal('graduated'),
        v.literal('suspended')
      )
    ),
    isArchived: v.optional(v.boolean()),
  })
    .index('by_prn', ['prn'])
    .index('by_userId', ['userId']),

  events: defineTable({
    name: v.string(),
    description: v.string(),
    location: v.optional(v.string()),
    totalParticipants: v.optional(v.number()),
    status: v.union(
      v.literal('draft'), // Submit VS Publish
      v.literal('scheduled'), // Start date
      v.literal('active'), // Ongoing
      v.literal('completed'), //  End date
      v.literal('cancelled') // For students to see
    ),
    coordinatorIds: v.array(
      v.object({
        id: v.id('users'), // Maybe do by email?
      })
    ),
    isPublic: v.boolean(),
    isDeleted: v.optional(v.boolean()),
    deletedAt: v.optional(v.string()),
    arrivingTime: v.optional(v.string()), // Automatically mark as late
    startDateTime: v.string(), // https://docs.convex.dev/database/types#working-with-dates-and-times
    endDateTime: v.string(),
    updatedAt: v.number(), // For created use _creationTime
    eligibilityCriteria: v.object({
      gender: v.optional(
        v.union(
          v.literal('MALE'),
          v.literal('FEMALE'),
          v.literal('BOTH'),
          v.literal('NONE')
        )
      ),
      requiredCGPA: v.optional(v.number()),
      maxBacklogs: v.optional(v.number()),
      allowedBatches: v.optional(v.array(v.number())),
      allowedDepartments: v.optional(
        v.array(
          v.union(
            v.literal('COMP'),
            v.literal('IT'),
            v.literal('ENTC'),
            v.literal('CIVIL'),
            v.literal('MECH')
          )
        )
      ),
    }),
  })
    .index('by_coordinator', ['coordinatorIds'])
    .index('by_name', ['name']),
})
