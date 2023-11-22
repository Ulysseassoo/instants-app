import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/utils/supabase/middleware"

const excludedPaths = ["/login", "/auth/callback"]

export async function middleware(request: NextRequest) {
	try {
		// This `try/catch` block is only here for the interactive tutorial.
		// Feel free to remove once you have Supabase connected.
		const { supabase, response } = createClient(request)
		const pathname = request.nextUrl.pathname

		// Refresh session if expired - required for Server Components
		// https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
		const {
			data: { session }
		} = await supabase.auth.getSession()

		// REDIRECT TO LOGIN IF USER IS NOT LOGGED IN
		if (!session && !excludedPaths.includes(pathname)) {
			const url = new URL(request.url)
			url.pathname = "/login"
			return NextResponse.redirect(url)
		}

		// REDIRECT TO ONBOARDING IF USER DOESN'T HAVE PROFILE
		if (session && !session.user.user_metadata.has_profile && pathname !== "/onboarding") {
			const url = new URL(request.url)
			url.pathname = "/onboarding"
			return NextResponse.redirect(url)
		}

		return response
	} catch (e) {
		// If you are here, a Supabase client could not be created!
		// This is likely because you have not set up environment variables.
		// Check out http://localhost:3000 for Next Steps.
		return NextResponse.next({
			request: {
				headers: request.headers
			}
		})
	}
}

export const config = {
	// Skip internal next files and static/favicon
	matcher: "/((?!api|static|.*\\..*|_next).*)"
}
