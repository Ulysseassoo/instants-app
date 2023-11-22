import React from "react"
import { cookies } from "next/headers"
import SidebarContent from "./SidebarContent"
import { createClient } from "@/utils/supabase/server"

interface Props {
	children: React.ReactNode
}

const Sidebar = async ({ children }: Props) => {
	const cookiesStore = cookies()
	const supabase = createClient(cookiesStore)
	const {
		data: { session }
	} = await supabase.auth.getSession()

	if (!session) return <> </>

	const { data } = await supabase.from("profiles").select("*").eq("user_id", session?.user.id).single()
	const { count: notificationsCount } = await supabase
		.from("notifications")
		.select("*", { count: "exact" })
		.eq("owner_user_id", data?.id)
		.is("is_read", false)

	if (!data || notificationsCount === null) return <> </>

	return (
		<SidebarContent notificationsCount={notificationsCount} profile={data} email={session.user.email}>
			{children}
		</SidebarContent>
	)
}

export default Sidebar
