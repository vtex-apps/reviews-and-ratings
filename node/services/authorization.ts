import type { Logger } from '@vtex/api'

import type { AuthorizationClient } from '../clients/authorization'
import type { ValidatedUser } from '../types'

const HEADER_VTEX_APP_KEY = 'x-vtex-api-appkey'
const HEADER_VTEX_APP_TOKEN = 'x-vtex-api-apptoken'
const HEADER_VTEX_COOKIE = 'vtexidclientautcookie'

/**
 * Port of C# AuthorizationService.RetrieveAuthenticatedUser
 * Reads various auth headers and tokens to find and validate a user.
 */
export async function retrieveAuthenticatedUser(
  authorizationClient: AuthorizationClient,
  headers: Record<string, string | string[] | undefined>,
  adminUserAuthToken: string | undefined,
  storeUserAuthToken: string | undefined,
  _logger: Logger
): Promise<ValidatedUser | null> {
  const vtexIdHeader = getHeader(headers, HEADER_VTEX_COOKIE)
  const vtexAppKey = getHeader(headers, HEADER_VTEX_APP_KEY)
  const vtexAppToken = getHeader(headers, HEADER_VTEX_APP_TOKEN)

  let token: string | null = null

  if (vtexIdHeader) {
    token = vtexIdHeader
  } else if (vtexAppKey && vtexAppToken) {
    const validatedToken = await authorizationClient.getAppkeyToken(
      vtexAppKey,
      vtexAppToken
    )

    if (validatedToken) {
      token = validatedToken.token
    }
  } else if (adminUserAuthToken) {
    token = adminUserAuthToken
  } else if (storeUserAuthToken) {
    token = storeUserAuthToken
  }

  if (!token) {
    return null
  }

  const authenticatedUser = await authorizationClient.validateUserToken(token)

  return authenticatedUser
}

export async function validateUserToken(
  authorizationClient: AuthorizationClient,
  token: string
): Promise<ValidatedUser | null> {
  return authorizationClient.validateUserToken(token)
}

export async function validateLicenseManagerAccess(
  authorizationClient: AuthorizationClient,
  userId: string
): Promise<boolean> {
  return authorizationClient.validateLicenseManagerAccess(userId)
}

function getHeader(
  headers: Record<string, string | string[] | undefined>,
  name: string
): string | null {
  const val = headers[name] ?? headers[name.toLowerCase()]

  if (!val) return null
  if (Array.isArray(val)) return val[0] ?? null

  return val
}
