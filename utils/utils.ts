import { redirect } from 'next/navigation'
import {
  StudentInterface as Student,
  UserInterface as User,
  EventInterface as Event,
  Department,
  allowedDepartments,
} from '@/types/tables'
import { StudentTableData } from '@/app/(root)/v1/students/studentTable'

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: 'error' | 'success',
  path: string,
  message: string,
  additionalParams: Record<string, string> = {} // See actions.ts
) {
  const queryParams = new URLSearchParams({
    [type]: encodeURIComponent(message),
    ...additionalParams,
  })

  return redirect(`${path}?${queryParams}`)
}

export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  keys.forEach((key) => delete result[key])
  return result
}

// Utility function to export data as CSV
export const exportToCSV = (
  data: User[] | Student[] | Event[] | StudentTableData[]
) => {
  const header = Object.keys(data[0]).join(',')
  const rows = data.map((item) =>
    Object.values(item)
      .map((value) => `"${value}"`)
      .join(',')
  )
  const csvContent = [header, ...rows].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'data.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export const exportToJSON = (
  data: User[] | Student[] | Event[] | StudentTableData[]
) => {
  const jsonContent = JSON.stringify(data, null, 2)

  const blob = new Blob([jsonContent], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'data.json'
  a.click()
  URL.revokeObjectURL(url)
}

const formatTime = (isoTime: string | Date) => {
  const date = new Date(isoTime)
  // return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  return date.toISOString().slice(11, 16)
}

export function parseJwt(token: string | null) {
  try {
    if (!token) return null
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch (e) {
    console.error('Error decoding JWT:', e)
    return null
  }
}

export const checkEligibility = async (
  student: Student,
  event: Event
): Promise<boolean> => {
  if (student && event) {
    let eligible = true

    // CGPA
    if (
      event.eligibilityCriteria?.requiredCGPA &&
      student.cgpa < event.eligibilityCriteria.requiredCGPA
    ) {
      eligible = false
      console.log('Not eligible due to CGPA')
    }

    // Backlogs
    if (
      event.eligibilityCriteria?.maxBacklogs !== undefined &&
      student.backlogs > event.eligibilityCriteria?.maxBacklogs
    ) {
      eligible = false
      console.log('Not eligible due to backlogs')
    }

    // Batch
    if (
      event.eligibilityCriteria?.allowedBatches &&
      event.eligibilityCriteria.allowedBatches.length > 0 &&
      !event.eligibilityCriteria.allowedBatches.includes(student.batchYear)
    ) {
      eligible = false
      console.log('Not eligible due to batch')
    }

    // Department
    if (
      event.eligibilityCriteria?.allowedDepartments &&
      event.eligibilityCriteria.allowedDepartments.length > 0 &&
      !event.eligibilityCriteria.allowedDepartments.includes(
        student.department as allowedDepartments
      )
    ) {
      eligible = false
      console.log('Not eligible due to department')
    }

    // Gender
    if (
      event.eligibilityCriteria?.gender &&
      event.eligibilityCriteria.gender !== 'BOTH' &&
      event.eligibilityCriteria.gender !== 'NONE' &&
      event.eligibilityCriteria.gender !== student.gender
    ) {
      eligible = false
      console.log('Not eligible due to gender')
    }

    // overrides
    if (student.eligibilityOverrides) {
      const isEligibleOverride =
        student.eligibilityOverrides.eligibleEvents?.some(
          (e) => e.id === event._id
        ) || false
      const isIneligibleOverride =
        student.eligibilityOverrides.ineligibleEvents?.some(
          (e) => e.id === event._id
        ) || false

      if (isEligibleOverride) {
        eligible = true
        console.log('Eligible due to override')
      } else if (isIneligibleOverride) {
        eligible = false
        console.log('Ineligible due to override')
      }
    }
    return eligible
  }
  return false
}

export const checkCoordinator = async (
  user: User,
  event: Event
): Promise<boolean> => {
  if (user && event) {
    return event.coordinatorIds.some((coordId) => coordId.id === user._id)
  }
  return false
}
