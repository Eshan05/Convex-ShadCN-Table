import { v } from 'convex/values'
import { Id } from '../convex/_generated/dataModel'
import { query, mutation } from './_generated/server'
import { getRegisteredStudentByUserId } from './students'
import { getAuthUserId } from '@convex-dev/auth/server'
