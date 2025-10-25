import { jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';

export interface JWTPayload extends JoseJWTPayload {
  userId: number;
  roleId: number;
  email: string;
}

/**
 * Gets the JWT secret key from environment variables.
 * Ensures the key is in the correct format (Uint8Array).
 */
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  // Encode the secret as a Uint8Array, as required by 'jose'
  return new TextEncoder().encode(secret);
}

/**
 * Verifies a JWT token.
 *
 * @param token The JWT token string from the cookie.
 * @returns The decoded payload if verification is successful, otherwise null.
 */
export async function verifySession(token: string): Promise<JWTPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify<JWTPayload>(token, secret);
    return payload;
  } catch (error) {
    // This will catch errors like "JWTExpired", "JWSInvalid", etc.
    console.error('JWT Verification Failed:', (error as Error).message);
    return null;
  }
}
