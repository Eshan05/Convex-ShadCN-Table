import { SignJWT, jwtVerify } from 'jose'
import { Id } from '../convex/_generated/dataModel'
// Don't use @/

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ||
    '800b39995d9d488495754d9a51127b5d5e7be0489841337817e2f5c213804abd'
)
const alg = 'HS256'

export interface TokenPayload {
  [key: string]: unknown
  studentId: Id<'students'>
  eventId: Id<'events'>
  exp: number // Expiration timestamp (seconds)
  iat: number // Issued at timestamp (seconds)
  jti: string // Unique token ID (JWT ID)
}

export async function generateQRToken(
  studentId: Id<'students'>,
  eventId: Id<'events'>,
  expiresInSeconds: number
): Promise<string> {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + expiresInSeconds

  const jti = crypto.randomUUID()

  const payload: TokenPayload = {
    studentId: studentId,
    eventId: eventId,
    exp,
    iat,
    jti,
  }

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .setJti(jti)
    .sign(secret)

  return jwt
}

export async function verifyAndDecodeQRToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    if (
      payload.studentId &&
      payload.eventId &&
      typeof payload.exp === 'number' &&
      typeof payload.iat === 'number' &&
      typeof payload.jti === 'string'
    ) {
      return payload as TokenPayload
    } else {
      console.error('Invalid token payload structure')
      return null
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}
