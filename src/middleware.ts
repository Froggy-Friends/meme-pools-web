import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PostHog } from 'posthog-node'

// Initialize PostHog with your API key
const posthog = new PostHog(
  process.env.NEXT_PUBLIC_POSTHOG_KEY!,
  { host: process.env.NEXT_PUBLIC_POSTHOG_HOST }
)

export async function middleware(request: NextRequest) {
  // Skip maintenance check for maintenance page itself
  if (request.nextUrl.pathname === '/maintenance') {
    return NextResponse.next()
  }

  try {
    const isEnabled = await posthog.isFeatureEnabled(
      'maintenance_mode',
      'middleware-user' // or use a real distinct_id if you have one
    )

    if (isEnabled) {
      return NextResponse.redirect(new URL('/maintenance', request.url))
    }
  } catch (error) {
    console.error('PostHog feature flag check failed:', error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
} 