import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session so it doesn't expire mid-session
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protect /dashboard routes (except demo)
  if (pathname.startsWith('/dashboard/') && !pathname.startsWith('/dashboard/demo-brand')) {
    // Allow worker PIN login page
    if (pathname.endsWith('/login')) {
      return supabaseResponse
    }
    // Redirect to /login if not authenticated
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }

    // Check trial expiry — allow settings page so owners/admins can pay,
    // and lookup tenant via memberships (invited admins/managers don't own
    // the client row).
    const isSettings = pathname.includes('/settings')
    if (!isSettings) {
      const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
      const slug = slugMatch?.[1]
      if (slug) {
        const { data: client } = await supabase
          .from('clients')
          .select('id, plan, trial_ends_at')
          .eq('slug', slug)
          .maybeSingle()

        if (client) {
          const { data: membership } = await supabase
            .from('memberships')
            .select('role')
            .eq('client_id', client.id)
            .eq('user_id', user.id)
            .maybeSingle()

          if (
            membership &&
            client.plan === 'trial' &&
            client.trial_ends_at &&
            new Date(client.trial_ends_at).getTime() < Date.now()
          ) {
            const url = request.nextUrl.clone()
            url.pathname = '/pricing'
            url.searchParams.set('expired', '1')
            return NextResponse.redirect(url)
          }
        }
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
