import { BatchList, DepList } from '@/app/(root)/v1/create/save'
import { CheckCircle, CircleOff } from 'lucide-react'

const currentYear = new Date().getFullYear()

export const batchYears = [
  {
    value: currentYear - 1,
    label: (currentYear - 1).toString(),
  },
  ...Array.from({ length: 4 }, (_, i) => {
    const year = currentYear + i
    return {
      value: year,
      label: year.toString(),
    }
  }),
]
export const departmentOptions = DepList
export const enrollmentStatus = [
  { value: 'active', label: 'Active', icon: CheckCircle },
  { value: 'on_leave', label: 'On leave', icon: CircleOff },
  { value: 'graduated', label: 'Graduated', icon: CircleOff },
  { value: 'suspended', label: 'Suspended', icon: CircleOff },
]

export const isArchivedOptions = [
  { value: true, label: 'Archived', icon: CheckCircle },
  { value: false, label: 'Not Archived', icon: CircleOff },
]

export const isBlacklistedOptions = [
  { value: true, label: 'Blacklisted', icon: CheckCircle },
  { value: false, label: 'Not Blacklisted', icon: CircleOff },
]

export const isPlacedOptions = [
  { value: true, label: 'Placed', icon: CheckCircle },
  { value: false, label: 'Not Placed', icon: CircleOff },
]

export const genderOptions = [
  { value: 'MALE', label: 'Male', icon: CheckCircle },
  { value: 'FEMALE', label: 'Female', icon: CircleOff },
]
