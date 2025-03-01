import { Id } from '../convex/_generated/dataModel'
import { TokenPayload } from '../lib/qr'

export async function generateQRToken(
  studentId: Id<'students'>,
  eventId: Id<'events'>,
  expiresInSeconds: number
): Promise<string> {
  const encoder = new TextEncoder()
  const secretKey = encoder.encode(
    process.env.JWT_SECRET ||
      '800b39995d9d488495754d9a51127b5d5e7be0489841337817e2f5c213804abd'
  )

  const payload = {
    studentId,
    eventId,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    iat: Math.floor(Date.now() / 1000), // Issue
    jti: crypto.randomUUID(), // ID
  }

  const encodedPayload = encoder.encode(JSON.stringify(payload))
  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = encoder.encode(JSON.stringify(header))

  const base64UrlEncode = (data: Uint8Array) => {
    return btoa(String.fromCharCode(...data))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  const encodedHeaderBase64 = base64UrlEncode(encodedHeader)
  const encodedPayloadBase64 = base64UrlEncode(encodedPayload)

  const dataToSign = `${encodedHeaderBase64}.${encodedPayloadBase64}`
  const encodedDataToSign = encoder.encode(dataToSign)

  const key = await crypto.subtle.importKey(
    'raw',
    secretKey,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'] // Key usages
  )

  const signature = await crypto.subtle.sign('HMAC', key, encodedDataToSign)
  const encodedSignatureBase64 = base64UrlEncode(new Uint8Array(signature))

  // 6. Concatenate to create the final token
  const token = `${encodedHeaderBase64}.${encodedPayloadBase64}.${encodedSignatureBase64}`
  // console.log(token)
  return token
}

export async function verifyQRToken(token: string): Promise<any | null> {
  try {
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    const secretKey = encoder.encode(
      process.env.JWT_SECRET ||
        '800b39995d9d488495754d9a51127b5d5e7be0489841337817e2f5c213804abd'
    )

    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid token format')
    }
    const [encodedHeaderBase64, encodedPayloadBase64, encodedSignatureBase64] =
      parts

    const base64UrlDecode = (str: string) => {
      try {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
        const decoded = atob(base64)
        const uint8Array = new Uint8Array(decoded.length)
        for (let i = 0; i < decoded.length; i++) {
          uint8Array[i] = decoded.charCodeAt(i)
        }
        return uint8Array
      } catch (error) {
        console.error('Base64URL Decode Error:', error)
        throw new Error('Invalid base64url encoded string: ' + error)
      }
    }

    const encodedHeader = base64UrlDecode(encodedHeaderBase64)
    const encodedPayload = base64UrlDecode(encodedPayloadBase64)

    const header = JSON.parse(decoder.decode(encodedHeader))
    const payload: TokenPayload = JSON.parse(decoder.decode(encodedPayload))

    if (
      typeof payload.studentId ||
      typeof payload.eventId ||
      typeof payload.exp !== 'number' ||
      typeof payload.iat !== 'number' ||
      typeof payload.jti !== 'string'
    ) {
      throw new Error('Invalid structure')
    }

    const dataToSign = `${encodedHeaderBase64}.${encodedPayloadBase64}`
    const encodedDataToSign = encoder.encode(dataToSign)

    const key = await crypto.subtle.importKey(
      'raw',
      secretKey,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    )

    const receivedSignature = base64UrlDecode(encodedSignatureBase64)
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      receivedSignature,
      encodedDataToSign
    )

    if (!isValid) {
      throw new Error('Invalid signature')
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token has expired')
    }

    // console.log(payload)
    return payload
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}
