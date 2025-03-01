import { Id } from '@/convex/_generated/dataModel'

export interface UserInterface {
  _id: Id<'users'>
  _creationTime: number
  roles?: ('student' | 'coordinator' | 'admin')[] | undefined
  isActive?: boolean | undefined
  email: string
  emailVerificationTime?: number
  name?: string
}

export interface StudentInterface {
  _id: Id<'students'>
  userId: Id<'users'>
  _creationTime: number
  onBoarded: boolean
  number: string
  prn: string
  batchYear: number
  department: string
  cgpa: number
  backlogs: number
  gender?: studentGender
  isBlacklisted?: boolean
  isPlaced: boolean
  isInterestedInPlacements: boolean
  optedForHigherStudy: boolean
  isEnrolled?: boolean
  enrollmentStatus?: enrollmentStatus
  isArchived?: boolean
  eventsAttended?: { id: Id<'events'> }[]
  eligibilityOverrides?: {
    isCoordinator: { id: Id<'events'> }[]
    eligibleEvents: { id: Id<'events'> }[]
    ineligibleEvents: { id: Id<'events'> }[]
  }
}

export interface EventInterface {
  _id: Id<'events'>
  _creationTime: number
  name: string
  description: string
  location?: string
  totalParticipants?: number
  status: EventStatus
  coordinatorIds: { id: Id<'users'> }[]
  isDeleted?: boolean
  deletedAt?: string
  isPublic: boolean
  arrivingTime?: string
  startDateTime: string
  endDateTime: string
  updatedAt: number
  eligibilityCriteria: {
    gender?: eventGender
    requiredCGPA?: number
    maxBacklogs?: number
    allowedBatches?: number[]
    allowedDepartments?: allowedDepartments[]
  }
}

export type enrollmentStatus = 'active' | 'on_leave' | 'graduated' | 'suspended'
export type studentGender = 'MALE' | 'FEMALE'
export type eventGender = 'MALE' | 'FEMALE' | 'BOTH' | 'NONE'
export type EventStatus =
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'completed'
  | 'cancelled'
export type allowedDepartments = 'COMP' | 'ENTC' | 'IT' | 'CIVIL' | 'MECH'
export type VerificationMethod = 'qr' | 'manual'

export enum Department {
  COMP,
  IT,
  ENTC,
  CIVIL,
  MECH,
}

export const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]
