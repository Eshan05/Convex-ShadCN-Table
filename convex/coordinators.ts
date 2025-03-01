import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { Doc, Id } from './_generated/dataModel'
import { getAuthUserId } from '@convex-dev/auth/server'

export const getCoordinatorsOnly = query({
  args: {},
  handler: async (ctx) => {
    const coordinators = await ctx.db
      .query('users')
      .withIndex('by_roles', (q) => q.eq('roles', 'coordinator' as any))
      .collect()

    return coordinators
  },
})

export const getCoordinators = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect()
    const coordinators = users.filter((user) => {
      return user.roles?.includes('coordinator')
    })
    return coordinators.map(({ _id, name, email }) => ({
      _id,
      name,
      email,
    }))
  },
})

export const getEventsUserIsCoordinator = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    const allEvents = await ctx.db.query('events').collect()
    const coordinatorEvents: Doc<'events'>[] = []

    for (const event of allEvents) {
      if (event.coordinatorIds.some((coordIdObj) => coordIdObj.id === userId)) {
        coordinatorEvents.push(event)
      }
    }

    return coordinatorEvents
  },
})

export const getEventsStudentIsCoordinator = query({
  args: { studentId: v.id('students') },
  handler: async (ctx, { studentId }) => {
    const student = await ctx.db.get(studentId)
    if (!student) {
      console.error('No student')
      return false
    }

    const allEvents = await ctx.db.query('events').collect()
    const coordinatorEvents: Doc<'events'>[] = []

    for (const event of allEvents) {
      if (
        event.coordinatorIds.some(
          (coordIdObj) => coordIdObj.id === student.userId
        )
      ) {
        coordinatorEvents.push(event)
      }
    }
    const cEs = student.eligibilityOverrides?.isCoordinator || []
    const coordinatorForEvents = await Promise.all(
      Array.from(cEs).map(async (eObj) => {
        const e = await ctx.db.get(eObj.id as Id<'events'>)
        return e
      })
    )

    const combinedEvents = [...coordinatorEvents]
    coordinatorForEvents.forEach((event) => {
      if (
        event &&
        !combinedEvents.find(
          (existingEvent) => existingEvent?._id === event._id
        )
      ) {
        combinedEvents.push(event)
      }
    })

    return combinedEvents.filter(Boolean) as Doc<'events'>[]
  },
})
