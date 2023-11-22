"use client"

import React, { createContext, useEffect, useState } from "react"
import { GiHamburgerMenu } from "react-icons/gi"
import { LuChevronFirst, LuChevronLast } from "react-icons/lu"
import ClientLogo from "./ClientLogo"
import { TbLogout } from "react-icons/tb"
import { useRouter } from "next/navigation"
import ProfilePicture from "./ProfilePicture"
import { createClient } from "@/utils/supabase/client"

interface Props {
	children: React.ReactNode
	profile: any
	email: string | undefined
	notificationsCount: number
}

export const SidebarContext = createContext({
	isExpand: true,
	profileId: "",
	notificationsCount: 0
})
const SidebarContent = ({ children, profile, email, notificationsCount }: Props) => {
	const supabase = createClient()
	const [updatedNotificationsCount, setUpdatedNotificationsCount] = useState(notificationsCount)
	const [isExpand, setIsExpanded] = useState(true)
	const [isMenuActivated, setIsMenuActivated] = useState(false)
	const router = useRouter()

	const logout = async () => {
		await supabase.auth.signOut()
		router.refresh()
		router.push("/login")
	}

	useEffect(() => {
		const notificationChannel = supabase
			.channel(`notifications`)
			.on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `owner_user_id=eq.${profile.id}` }, async (payload) => {
				const { count } = await supabase.from("notifications").select("*", { count: "exact" }).eq("owner_user_id", profile.id).is("is_read", false)
				if (count !== null) {
					setUpdatedNotificationsCount(count)
				}
			})
			.subscribe()

		return () => {
			supabase.removeChannel(notificationChannel)
		}
	}, [profile.id])

	return (
		<aside className="h-screen w-fit sticky left-0 top-0 z-20 hidden lg:block md:block sm:block xl:block ">
			<nav className="h-full flex flex-col border-r border-slate-700 shadow-md bg-slate-900">
				<div className={`p-4 pb-2 flex ${isExpand ? "justify-between" : "justify-center"} items-center`}>
					<div className={`overflow-hidden transition-all ${isExpand ? "w-fit" : "w-0"}`}>
						<ClientLogo />
					</div>
					<button className="p-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-black svg-fit" onClick={() => setIsExpanded((value) => !value)}>
						{isExpand ? <LuChevronFirst /> : <LuChevronLast />}
					</button>
				</div>

				<SidebarContext.Provider value={{ isExpand, profileId: profile.id, notificationsCount: updatedNotificationsCount }}>
					<ul className="flex-1 px-3">{children}</ul>
				</SidebarContext.Provider>

				<div className="border-t flex p-3 relative border-slate-700">
					<ProfilePicture avatar_url={profile.avatar_url} username={profile.username} />

					<div className={`flex justify-between items-center overflow-hidden transition-all ${isExpand ? "w-52 ml-3" : "w-0"}`}>
						<div className="leading-4">
							<h4 className="font-semibold text-white">{profile.username}</h4>
							<span className="text-xs text-slate-400 truncate w-40 inline-block">{email}</span>
						</div>
						<button onClick={() => setIsMenuActivated((value) => !value)} className="w-6 h-6 text-white svg-fit">
							<GiHamburgerMenu />
						</button>
					</div>
					{isMenuActivated && (
						<div
							className="absolute bottom-16 z-10 mb-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-slate-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
							role="menu"
							aria-orientation="vertical"
							aria-labelledby="menu-button"
							tabIndex={-1}>
							<div
								className="py-1 px-2 flex items-center text-red-500 w-full hover:bg-slate-400 rounded-md my-1 transition-all duration-200 cursor-pointer"
								role="none"
								onClick={logout}>
								<TbLogout />
								<span className="text-white block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-6">
									Logout
								</span>
							</div>
						</div>
					)}
				</div>
			</nav>
		</aside>
	)
}

export default SidebarContent
