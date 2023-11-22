import AccountProfile from "@/components/onboarding/AccountProfile"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import React from "react"

const Page = async () => {
	const cookiesStore = cookies()
	const supabse = createClient(cookiesStore)
	const {
		data: { session }
	} = await supabse.auth.getSession()

	if (!session) {
		redirect("/login")
	}

	if (session.user.user_metadata.has_profile) {
		redirect("/")
	}

	const { data } = await supabse.from("profiles").select("*").eq("user_id", session?.user.id).single()

	return (
		<main className="min-h-screen w-full relative bg-slate-900 flex-col justify-start px-10 py-20 text-white max-md:px-4 max-md:py-8">
			<div className="mx-auto max-w-3xl">
				<h1 className="text-xl">Onboarding</h1>
				<p className="text-md text-slate-500 opacity-80 mt-3">Complete your profil before proceeding to your feed.</p>
				<section className="mt-9 bg-slate-800 p-10 rounded-md">
					<AccountProfile user={data} />
				</section>
			</div>
		</main>
	)
}

export default Page
