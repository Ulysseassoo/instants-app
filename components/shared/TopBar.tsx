import { redirect } from "next/navigation"
import React, { useEffect, useState } from "react"
import { cookies, headers } from "next/headers"
import { createClient } from "@/utils/supabase/server"

const pagesTitles = [
	{
		text: "Home",
		href: "/"
	},
	{
		text: "Search",
		href: "/search"
	},
	{
		text: "Notifications",
		href: "/notifications"
	},
	{
		text: "Create Post",
		href: "/create-post"
	},
	{
		text: "Communities",
		href: "/communities"
	},
	{
		text: "Profile",
		href: "/profile"
	},
	{
		text: "Messages",
		href: "/messages"
	},
	{
		text: "Post",
		href: "/post"
	}
]

const getTitleByPathname = async (username: string | null, pathname: string): Promise<string> => {
	const page = pagesTitles.find((item) => item.href === pathname)

	if (pathname.includes("/profile") && username) {
		return username
	}

	if (pathname.includes("/post")) {
		return "Post"
	}

	if (page) {
		return page.text
	}

	return ""
}

const TopBar = async () => {
	const headersList = headers()
	const cookiesStore = cookies()
	const supabase = createClient(cookiesStore)

	const {
		data: { session }
	} = await supabase.auth.getSession()

	if (!session) {
		redirect("/login")
	}

	const { data } = await supabase.from("profiles").select("*").eq("user_id", session?.user.id).single()

	if (!data) {
		redirect("/login")
	}

	const pathname = headersList.get("x-invoke-path") || ""
	const title = await getTitleByPathname(data.full_name, pathname)

	return (
		<div className="px-4 h-16 w-full bg-slate-900/80 backdrop-blur-md items-center flex sticky top-0 left-0 z-20">
			<h1 className="text-xl text-white font-bold">{title}</h1>
		</div>
	)
}

export default TopBar
