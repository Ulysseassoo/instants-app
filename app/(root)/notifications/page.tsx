import React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import NotificationsList from "@/components/notifications/NotificationsList"
import TopBar from "@/components/shared/TopBar"
import { createClient } from "@/utils/supabase/server"

export const revalidate = 0
const Page = async () => {
	const cookiesStore = cookies()
	const supabse = createClient(cookiesStore)
	const {
		data: { session }
	} = await supabse.auth.getSession()

	if (!session) {
		redirect("/login")
	}

	const { data } = await supabse.from("profiles").select("*").eq("user_id", session?.user.id).single()

	if (!data) {
		redirect("/login")
	}

	const { data: notifications } = await supabse
		.from("notifications")
		.select("*, profile:profile_id(*), post:post_id(*), comment:comment_id(*)")
		.eq("owner_user_id", data?.id)
		.order("created_at", {
			ascending: false
		})

	return (
		<section>
			<section className="mt-10 flex flex-col gap-5">
				<NotificationsList notifications={notifications ?? []} currentUserId={data.id} />
			</section>
		</section>
	)
}

export default Page
