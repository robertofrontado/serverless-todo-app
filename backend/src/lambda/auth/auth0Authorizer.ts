import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJPQsTjyPQJA8IMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi02dDhvdGZxcS5ldS5hdXRoMC5jb20wHhcNMjAwNTE0MDgxNDAyWhcN
MzQwMTIxMDgxNDAyWjAkMSIwIAYDVQQDExlkZXYtNnQ4b3RmcXEuZXUuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr9itx1bNcm37GoCX
SHVAqrcCC9/FRneko9n7masOpCHlsSWGNeM/AgNz2mLuCLLBIiPvJFs+6GxqjWbr
65GqO4h80pqwA0nMojdPWTCnjMq2lG5hsh6uYkFuox1wO6R1p9UMe9jwJSMWCCXk
yVR/vMSFJQVt3WoGnNPX5wD3kfRnWXmbcN0J+hD5rNsmSpX5n/qiFpG2TWJ4cA+f
GOXxXgH//7/K/eKaNJXX8j6siCp8ZcYbKd1xDE1i6eaQGMhyQSBGLHqYlGLNsg1K
LQfXabupaN6qIZ+V+vMJZ64xn5C5YWrtlmJ7Uh+hKAOqVvCiHCAcozZdHZJBl41K
UKxBKwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRyOvsxCPRf
0Chnuda+IKdMb4/8YTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AD5C48RkxdGf4D/NKKcAykHDbqT0bxH9VXbtg8WHnffVKrA/29zyp6jHWpxKpQDO
5s2Dwy7JU5sCI+axuJfRcI4w+XYo3hoTvWjo8/qurvsiv3W7HbPJ30TlCD6/Z7fW
J+HtaKrYqTMFJ/+t0nMEt5xD240AGjvwzIXb+LqNVaXuyImLZ9hidlVSevHnrCEb
EZLB8gnIuifpFLBMo1h3GFOZYOKDjsuyZkxqymE6pl21wE7jrYR0yWeU9d6KhD3o
Xua+s2abcRdp/jXRYcsZ2azEkjM90pbctM2iUtRkhf0ud6Y53Ea1pU25H314l6ij
7PDkJW++Os9D+cglfZfEyww=
-----END CERTIFICATE-----`

export const handler = middy(async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
})

function verifyToken(authHeader: string): JwtPayload {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(
    token, 
    cert,
    { algorithms: ['RS256']}
  ) as JwtPayload
}

handler.use(
  cors({
    credentials: true
  })
)
