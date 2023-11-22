"use client"

import { redirect, usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

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

const getTitleByPathname = (pathname: string) => {
	const page = pagesTitles.find((item) => item.href === pathname)

	if (pathname.includes("/post")) {
		return "Post"
	}

	if (page) {
		return page.text
	}

	return ""
}

const TopBar = () => {
	const supabase = createClient()
	const pathname = usePathname()
	const title = getTitleByPathname(pathname)

	return (
		<div className="px-4 h-16 w-full bg-slate-900/80 backdrop-blur-md items-center flex sticky top-0 left-0 z-20">
			<h1 className="text-xl text-white font-bold">{title}</h1>
		</div>
	)
}

export default TopBar
