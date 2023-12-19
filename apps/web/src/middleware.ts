import { withAuth } from "next-auth/middleware"
export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if(!token) return false;

        return true
      },
    },
  }
)

export const config = { matcher: ["/dashboard", "/events", "/flows", "/apps"] }