import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { Id } from './_generated/dataModel'
import { getAuthUserId } from '@convex-dev/auth/server'
import { on } from 'events'

export const createStudent = mutation({
  args: {
    data: v.object({
      firstName: v.string(),
      middleName: v.string(),
      lastName: v.string(),
      phoneNumber: v.number(),
      batchYear: v.number(),
      prn: v.string(),
      department: v.union(
        v.literal('COMP'),
        v.literal('IT'),
        v.literal('ENTC'),
        v.literal('CIVIL'),
        v.literal('MECH')
      ),
      cgpa: v.number(),
      backlogs: v.number(),
      gender: v.union(v.literal('MALE'), v.literal('FEMALE')),
      isPlaced: v.boolean(),
      optedForHigherStudy: v.boolean(),
      isInterestedInPlacements: v.boolean(),
      isBlacklisted: v.boolean(),
    }),
  },
  handler: async (ctx, { data }) => {
    // console.log(data)
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      console.log(identity)
      throw new Error('Not authenticated')
    }

    const userId = identity.subject.split('|')[0] as Id<'users'>
    const user = await ctx.db.get(userId)
    if (!user) throw new Error('User not found')
    const firstName = data.firstName.trim()
    const middleName = data.middleName.trim()
    const lastName = data.lastName.trim()
    const name = [firstName, middleName, lastName].filter(Boolean).join(' ')

    const studentId = await ctx.db.insert('students', {
      userId: user._id,
      number: data.phoneNumber.toString(),
      prn: data.prn,
      batchYear: data.batchYear,
      department: data.department,
      cgpa: data.cgpa,
      backlogs: data.backlogs,
      gender: data.gender,
      isPlaced: data.isPlaced,
      optedForHigherStudy: data.optedForHigherStudy,
      isInterestedInPlacements: data.isInterestedInPlacements,
      onBoarded: true,
      isEnrolled: true,
      enrollmentStatus: 'active',
      isArchived: false,
      isBlacklisted: false,
    })

    await ctx.db.patch(user._id, {
      roles: ['student'],
      name: name,
      isActive: true,
    })

    return studentId
  },
})

export const checkAlreadyRegisteredStudent = mutation({
  args: { prn: v.string() },
  handler: async (ctx, { prn }) => {
    const existingStudent = await ctx.db
      .query('students')
      .filter((q) => q.eq(q.field('prn'), prn))
      .first()
    return !!existingStudent
  },
})

export const getStudentByUserId = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    const student = await ctx.db
      .query('students')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first()
    if (!student) {
      console.log('User is not in the students table')
      // return { error: 'User not found in students table' }
      return null
    }
    return student
  },
})

export const getRegisteredStudentByUserId = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    console.log(`Fetching student with userId: ${userId}`)
    const student = await ctx.db
      .query('students')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first()
    console.log(`Fetched student: ${JSON.stringify(student)}`)
    return student
  },
})

export const getFullStudentByUserId = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    const student = await ctx.db
      .query('students')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first()

    if (!student) return null
    const user = await ctx.db.get(student.userId)
    if (!user) return null
    return {
      ...student,
      name: user.name,
      email: user.email,
    }
  },
})

export const getCurrentStudent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null

    return await ctx.db
      .query('students')
      .filter((q) => q.eq(q.field('userId'), userId))
      .first()
  },
})

export const checkUniquePRN = query({
  args: { prn: v.string() },
  handler: async (ctx, { prn }) => {
    const existing = await ctx.db
      .query('students')
      .withIndex('by_prn', (q) => q.eq('prn', prn))
      .first()
    return !!existing
  },
})

export const archiveStudent = mutation({
  args: { id: v.id('students') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isArchived: true })
  },
})

export const getStudentsForTable = query({
  args: {},
  handler: async (ctx) => {
    const students = await ctx.db.query('students').collect()
    const allEvents = await ctx.db.query('events').collect()
    const eventIdToName: Record<Id<'events'>, string> = {}
    allEvents.forEach((event) => {
      eventIdToName[event._id] = event.name
    })

    const transformedStudents = await Promise.all(
      students.map(async (student) => {
        const user = await ctx.db.get(student.userId)
        const userName = user?.name || 'Unknown User'
        const userEmail = user?.email || 'Unknown Email'
        const isActive = user?.isActive || false

        const coordinatorForEvents =
          student.eligibilityOverrides?.isCoordinator?.map((eventObj) => ({
            id: eventObj.id,
            name: eventIdToName[eventObj.id] || 'Unknown Event',
          })) || []

        const eligibleEvents =
          student.eligibilityOverrides?.eligibleEvents?.map((eventObj) => ({
            id: eventObj.id,
            name: eventIdToName[eventObj.id] || 'Unknown Event',
          })) || []

        const ineligibleEvents =
          student.eligibilityOverrides?.ineligibleEvents?.map((eventObj) => ({
            id: eventObj.id,
            name: eventIdToName[eventObj.id] || 'Unknown Event',
          })) || []
        const eventsAttended =
          student.eventsAttended?.map((eventObj) => ({
            id: eventObj.id,
            name: eventIdToName[eventObj.id] || 'Unknown Event',
          })) || []

        return {
          ...student,
          userName,
          userEmail,
          coordinatorForEvents,
          eligibleEvents,
          ineligibleEvents,
          eventsAttended,
          eligibilityOverrides: undefined,
        }
      })
    )

    return { transformedStudents, eventIdToName }
  },
})

export const updateStudent = mutation({
  args: {
    id: v.id('students'),
    updates: v.object({
      _id: v.optional(v.id('students')),
      userName: v.optional(v.string()),
      userEmail: v.optional(v.string()), // Expect email
      userId: v.optional(v.string()), // Expect email
      isActive: v.optional(v.boolean()),
      onBoarded: v.boolean(),
      number: v.string(),
      prn: v.string(),
      batchYear: v.number(),
      gender: v.union(v.literal('MALE'), v.literal('FEMALE')),
      department: v.union(
        v.literal('COMP'),
        v.literal('IT'),
        v.literal('ENTC'),
        v.literal('CIVIL'),
        v.literal('MECH')
      ),
      cgpa: v.number(),
      backlogs: v.number(),
      eligibilityOverrides: v.optional(
        v.object({
          isCoordinator: v.array(v.object({ id: v.id('events') })),
          eligibleEvents: v.array(v.object({ id: v.id('events') })),
          ineligibleEvents: v.array(v.object({ id: v.id('events') })),
        })
      ),
      eventsAttended: v.optional(v.array(v.object({ id: v.id('events') }))),
      isBlacklisted: v.boolean(),
      isPlaced: v.boolean(),
      isArchived: v.optional(v.boolean()),
      isInterestedInPlacements: v.boolean(),
      optedForHigherStudy: v.boolean(),
      isEnrolled: v.optional(v.boolean()),
      enrollmentStatus: v.optional(
        v.union(
          v.literal('active'),
          v.literal('on_leave'),
          v.literal('graduated'),
          v.literal('suspended')
        )
      ),
    }),
  },
  handler: async (ctx, args) => {
    const { id, updates } = args
    await ctx.db.patch(id, {
      onBoarded: updates.onBoarded,
      number: updates.number,
      prn: updates.prn,
      batchYear: updates.batchYear,
      department: updates.department,
      cgpa: updates.cgpa,
      gender: updates.gender,
      backlogs: updates.backlogs,
      eligibilityOverrides: updates.eligibilityOverrides,
      eventsAttended: updates.eventsAttended,
      isBlacklisted: updates.isBlacklisted,
      isPlaced: updates.isPlaced,
      isArchived: updates.isArchived,
      isInterestedInPlacements: updates.isInterestedInPlacements,
      optedForHigherStudy: updates.optedForHigherStudy,
      isEnrolled: updates.isEnrolled,
      enrollmentStatus: updates.enrollmentStatus,
    })
  },
})

export const updateStudentSelf = mutation({
  args: {
    id: v.id('students'),
    cgpa: v.number(),
    backlogs: v.number(),
    isPlaced: v.boolean(),
    isInterestedInPlacements: v.boolean(),
    optedForHigherStudy: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      cgpa: args.cgpa,
      backlogs: args.backlogs,
      isPlaced: args.isPlaced,
      isInterestedInPlacements: args.isInterestedInPlacements,
      optedForHigherStudy: args.optedForHigherStudy,
    })
  },
})
