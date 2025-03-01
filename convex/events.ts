import { paginationOptsValidator } from 'convex/server'
import { Doc, Id } from './_generated/dataModel'
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const createEvent = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    status: v.union(
      v.literal('draft'),
      v.literal('scheduled'),
      v.literal('active'),
      v.literal('completed'),
      v.literal('cancelled')
    ),
    coordinatorIds: v.array(v.object({ id: v.id('users') })),
    isPublic: v.boolean(),
    location: v.string(),
    totalParticipants: v.optional(v.number()),
    isDeleted: v.optional(v.boolean()),
    arrivingTime: v.string(),
    startDateTime: v.string(),
    endDateTime: v.string(),
    updatedAt: v.optional(v.number()),
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
      allowedBatches: v.optional(v.array(v.number())),
    }),
  },
  handler: async (ctx, args) => {
    const eventId = await ctx.db.insert('events', {
      ...args,
      updatedAt: Date.now(),
    })
    return eventId
  },
})

export const getAllEventsRaw = query({
  handler: async (ctx) => {
    const events = await ctx.db.query('events').collect()
    return events
  },
})

export const getAllEvents = query({
  handler: async (ctx) => {
    const events = await ctx.db.query('events').collect()
    const transformedEvents = await Promise.all(
      events.map(async (event) => {
        const coordinatorNames = await Promise.all(
          event.coordinatorIds.map(async ({ id }) => {
            const user: Doc<'users'> | null = await ctx.db.get(id)
            return user ? user.name || user.email : 'Imposter'
          })
        )

        return {
          ...event,
          coordinatorNames,
        }
      })
    )

    return transformedEvents
  },
})

export const getAllEventsPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query('events')
      .order('desc')
      .paginate(args.paginationOpts)

    const transformedEvents = {
      ...events,
      page: await Promise.all(
        events.page.map(async (event) => {
          const coordinatorNames = await Promise.all(
            event.coordinatorIds.map(async ({ id }) => {
              const user: Doc<'users'> | null = await ctx.db.get(id)
              return user ? user.name || user.email : 'Imposter'
            })
          )

          return {
            ...event,
            coordinatorNames,
          }
        })
      ),
    }

    return transformedEvents
  },
})

export const updateEvent = mutation({
  args: {
    _id: v.id('events'),
    name: v.string(),
    description: v.string(),
    status: v.union(
      v.literal('draft'),
      v.literal('scheduled'),
      v.literal('active'),
      v.literal('completed'),
      v.literal('cancelled')
    ),
    coordinatorIds: v.array(v.object({ id: v.id('users') })),
    isPublic: v.boolean(),
    location: v.string(),
    totalParticipants: v.optional(v.number()),
    isDeleted: v.optional(v.boolean()),
    arrivingTime: v.string(),
    startDateTime: v.string(),
    endDateTime: v.string(),
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
    updatedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { _id, ...rest } = args
    await ctx.db.patch(_id, { ...rest, updatedAt: Date.now() })
  },
})

export const getEventById = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, { eventId }) => {
    const event = await ctx.db
      .query('events')
      .filter((q) => q.eq(q.field('_id'), eventId))
      .first()
    return event
  },
})

export const deleteEvent = mutation({
  args: { id: v.id('events') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    })
  },
})

export const restoreEvent = mutation({
  args: { id: v.id('events') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isDeleted: false, deletedAt: undefined })
  },
})

export const getEventsForStudent = query({
  args: { studentId: v.id('students') },
  handler: async (ctx, { studentId }) => {
    if (!studentId) throw new Error('Student ID not provided')
    const student = await ctx.db.get(studentId)
    if (!student) throw new Error('Student not found')

    const allEvents = await ctx.db.query('events').collect()
    const eligibleEventsIds = new Set<Id<'events'>>()
    for (const e of allEvents) {
      const c = e.eligibilityCriteria
      if (
        c.requiredCGPA &&
        c.requiredCGPA === undefined &&
        student.cgpa < c?.requiredCGPA
      )
        continue
      if (
        c.maxBacklogs &&
        c.maxBacklogs === undefined &&
        student.backlogs > c?.maxBacklogs
      )
        continue
      if (
        c.allowedBatches &&
        c.allowedBatches.length > 0 &&
        !c.allowedBatches.includes(student.batchYear)
      )
        continue
      if (
        c.allowedDepartments &&
        c.allowedDepartments.length > 0 &&
        !c.allowedDepartments.includes(student.department)
      )
        continue
      if (
        c.gender &&
        c.gender !== 'BOTH' &&
        c.gender !== 'NONE' &&
        c.gender !== student.gender
      )
        continue
      eligibleEventsIds.add(e._id)
    }

    if (student.eligibilityOverrides) {
      student.eligibilityOverrides.eligibleEvents?.forEach((eObj) => {
        eligibleEventsIds.add(eObj.id as Id<'events'>)
      })
      student.eligibilityOverrides.ineligibleEvents?.forEach((eObj) => {
        eligibleEventsIds.delete(eObj.id as Id<'events'>)
      })
      student.eligibilityOverrides.isCoordinator?.forEach((eObj) => {
        eligibleEventsIds.add(eObj.id as Id<'events'>)
      })
    }

    const eligibleEvents = await Promise.all(
      Array.from(eligibleEventsIds).map(async (eventId) => {
        const e = await ctx.db.get(eventId)
        if (!eventId) return null

        const hasAttended = !!student.eventsAttended?.find(
          (attendedEvent) => attendedEvent.id === e?._id
        )

        return {
          ...e,
          hasAttended,
        }
      })
    )
    if (student.isBlacklisted) eligibleEvents.push(null)
    return eligibleEvents.filter(Boolean) as (Doc<'events'> & {
      hasAttended: boolean
    })[]
  },
})
