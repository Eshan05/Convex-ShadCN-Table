import { z } from 'zod'

export const EventFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Event name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  status: z.union([
    z.literal('draft'),
    z.literal('scheduled'),
    z.literal('active'),
    z.literal('completed'),
    z.literal('cancelled'),
  ]),
  coordinatorIds: z.array(
    z.string().min(1, {
      message: 'At least one coordinator is required.',
    })
  ),
  isPublic: z.boolean(),
  location: z.string().min(1, {
    message: 'Location is required.',
  }),
  totalParticipants: z.coerce.number().optional().default(0),
  isDeleted: z.boolean().default(false).optional(),
  arrivingTime: z.string().min(1, {
    message: 'Arriving time is required.',
  }),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  updatedAt: z.number().optional().default(Date.now()),
  eligibilityCriteria: z.object({
    gender: z.optional(z.enum(['MALE', 'FEMALE', 'BOTH', 'NONE'])),
    requiredCGPA: z.coerce.number().min(0).max(10),
    maxBacklogs: z.coerce.number().min(0).max(10),
    allowedDepartments: z.array(z.string()).min(1),
    allowedBatches: z.array(z.coerce.number()).min(1),
  }),
})

export const depToString = (dep: string): string => {
  switch (dep) {
    case 'COMP':
      return 'Computer'
    case 'IT':
      return 'Information Technology'
    case 'ENTC':
      return 'Electronics and Telecommunication'
    case 'MECH':
      return 'Mechanical Engineering'
    case 'CIVIL':
      return 'Civil Engineering'
    default:
      return ''
  }
}

export const DepList = [
  {
    value: 'COMP',
    label: depToString('COMP'),
  },
  {
    value: 'IT',
    label: depToString('IT'),
  },
  {
    value: 'ENTC',
    label: depToString('ENTC'),
  },
  {
    value: 'MECH',
    label: depToString('MECH'),
  },
  {
    value: 'CIVIL',
    label: depToString('CIVIL'),
  },
]

const currentYear = new Date().getFullYear()

export const BatchList = [
  {
    value: (currentYear - 1).toString(),
    label: (currentYear - 1).toString(),
  },
  ...Array.from({ length: 4 }, (_, i) => {
    const year = currentYear + i
    return {
      value: year.toString(),
      label: year.toString(),
    }
  }),
]
