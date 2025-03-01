import {
  convexAuthNextjsMiddleware,
  convexAuthNextjsToken,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server'
import { api } from './convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // const isAuthenticated = await convexAuth.isAuthenticated()
  // if (isAuthenticated && !isSignInPage(request)) {
  //   // const token = await convexAuth.getToken();
  //   const token = await convexAuthNextjsToken()
  //   if (token) {
  //     // const roles = await fetchQuery(api.users.getUserRoles)
  //     // console.log('User Roles:', roles)
  //     const userData = await fetchQuery(
  //       api.users.getCurrentUserById,
  //       {},
  //       { token }
  //     )
  //   }
  // }

  return undefined
})

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
