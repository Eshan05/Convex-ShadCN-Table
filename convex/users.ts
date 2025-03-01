import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import { api } from './_generated/api'
import { Doc, Id } from './_generated/dataModel'
import { mutation, query, QueryCtx } from './_generated/server'
import { cookies } from 'next/headers'

export async function requireCurrentUser(ctx: QueryCtx): Promise<Doc<'users'>> {
  const user = await ctx.runQuery(api.users.getCurrentUserById)
  if (!user) throw new Error('User not found')

  return user
}

export const getUserIdFromIdentity = async (
  // Use via mutation on frontend
  ctx: QueryCtx
): Promise<Id<'users'> | null> => {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    console.log(identity)
    return null
  }

  return identity.subject.split('|')[0] as Id<'users'>
}

export const getUserFromIdentity = async (
  // @ts-ignore
  ctx: any
): Promise<Id<'users'> | null> => {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    console.log(identity)
    return null
  }

  const userId = identity.subject.split('|')[0] as Id<'users'>
  return await ctx.db.get(userId)
}

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), args.email))
      .first()

    return user?._id || null // Return the user ID or null if not found
  },
})

// getCurrentUser
export const getCurrentUserById = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      console.log('No user ID found')
      return null
    }
    const user = await ctx.db.get(userId)
    // console.log('Current user:', user)
    return user
  },
})

export async function getUserRoles(ctx: QueryCtx): Promise<string[] | null> {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    // console.log(identity)
    return null
  }

  const userId = identity.subject.split('|')[0] as Id<'users'>
  const user = await ctx.db.get(userId)
  return user?.roles || []
}

export const getUsersByIds = query({
  args: { userIds: v.array(v.id('users')) },
  handler: async (ctx, args) => {
    const userDocs = await Promise.all(
      args.userIds.map(async (userId) => {
        return await ctx.db.get(userId)
      })
    )
    return userDocs.filter(Boolean)
  },
})

export const deactivateUser = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), email))
      .first()
    if (user) {
      await ctx.db.patch(user._id, { isActive: false })
    }
  },
})

export const updateCurrentUserRole = mutation({
  args: { roles: v.array(v.literal('student')) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) return null
    await ctx.db.patch(userId, { roles: args.roles, isActive: true })
    return await ctx.db.get(userId)
  },
})

// export const getCurrentUserByIdCookies = query({
//   args: {},
//   handler: async (ctx) => {
//     const cookieStore = await cookies()
//     const userCookie = cookieStore.get('user')
//     if (userCookie) {
//       try {
//         console.log(userCookie.value)
//         return JSON.parse(userCookie.value) as Doc<'users'>;
//       } catch (error) {
//         console.error("Error parsing user cookie in server:", error);
//       }
//     }

//     const userId = await getAuthUserId(ctx)
//     if (userId === null) return null
//     return await ctx.db.get(userId)
//   },
// })

export const updateUser = mutation({
  args: {
    id: v.id('users'),
    name: v.string(),
    email: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
      email: args.email,
      isActive: args.isActive,
    })
  },
})

export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query('users').collect()
  },
})
