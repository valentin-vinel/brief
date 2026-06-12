import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  // Build a mutable response so Supabase can refresh the session cookie.
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write refreshed cookies onto both the request and the response so
          // Server Components that run after this proxy see the updated session.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl
  const isPrivate = pathname.startsWith("/dashboard")

  if (isPrivate && !session) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  return response
}

export const config = {
  matcher: [
    // Skip Next.js internals and static assets
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
