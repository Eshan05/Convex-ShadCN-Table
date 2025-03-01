import { Doc, Id } from '@/convex/_generated/dataModel'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { UserInterface } from '@/types/tables'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertISOToIST(isoDateString: string): string {
  const date = new Date(isoDateString)
  const istOffset = 5.5 * 60
  const utcOffset = date.getTimezoneOffset()
  const istDate = new Date(date.getTime() + (istOffset + utcOffset) * 60000)
  return istDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
}

interface UserObject {
  _creationTime: number
  _id: string
  email: string
  isActive?: boolean
  name?: string
  roles?: string[]
}

export function decodeU(
  encodedString: string
): Doc<'users'> | null | undefined {
  try {
    const decodedString = decodeURIComponent(encodedString)
    const userObject: UserObject | UserInterface = JSON.parse(decodedString)
    // console.log(userObject)
    if (
      typeof userObject._creationTime === 'number' &&
      typeof userObject._id === 'string' &&
      typeof userObject.email === 'string' &&
      (typeof userObject.isActive === 'boolean' ||
        userObject.isActive === undefined) &&
      (typeof userObject.name === 'string' || userObject.name === undefined) &&
      (Array.isArray(userObject.roles) || userObject.roles === undefined) &&
      (userObject.roles === undefined ||
        userObject.roles.every((role: string) => typeof role === 'string'))
    ) {
      return {
        ...userObject,
        _id: userObject._id as Id<'users'>,
      } as Doc<'users'> | null | undefined
    } else {
      console.error('Invalid user data format after parsing:', userObject)
      return null
    }
  } catch (error) {
    console.error('Error decoding or parsing user data:', error)
    return null
  }
}
