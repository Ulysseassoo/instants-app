"use client"

import { usePathname } from "next/navigation"
import React, { useContext } from "react"
import { LuBell, LuCross, LuGlobe2, LuHome, LuMessageSquare, LuSearch, LuUser } from "react-icons/lu"
import { IconType } from "react-icons/lib"
import { SidebarContext } from "./SidebarContent"

interface Props {
	href: string
	text: string
	isMobile?: boolean
	isAlert?: boolean
}

const sidebarIcons = [
	{
		text: "Home",
		Icon: LuHome
	},
	{
		text: "Search",
		Icon: LuSearch
	},
	{
		text: "Notifications",
		Icon: LuBell
	},
	{
		text: "Create Post",
		Icon: LuCross
	},
	{
		text: "Communities",
		Icon: LuGlobe2
	},
	{
		text: "Profile",
		Icon: LuUser
	},
	{
		text: "Messages",
		Icon: LuMessageSquare
	}
]

const getIconByText = (text: string): IconType | null => {
	const iconObject = sidebarIcons.find((item) => item.text === text)

	if (iconObject) {
		return iconObject.Icon
	}

	return null
}

const checkIfActive = ({ pathname, href, profileId }: { pathname: string; href: string; profileId: string }) => {
	if (pathname.includes("profile") && href === "/profile" && pathname.split("/")[2] === profileId) {
		return true
	}

	return pathname === href
}

const SidebarItem = ({ text, href, isMobile, isAlert }: Props) => {
	const pathname = usePathname()
	const IconComponent = getIconByText(text)
	const { isExpand, profileId, notificationsCount } = useContext(SidebarContext)
	const isActive = checkIfActive({
		pathname,
		href,
		profileId
	})
	const hasAlert = Boolean(notificationsCount > 0 && isAlert && text === "Notifications")
	const source = href === "/profile" ? `${href}/${profileId}` : href

	if (isMobile) {
		return (
			<li
				className={`text-black relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ease-in ml-2 group ${
					isActive ? "bg-gradient-to-tr from-secondary to-primary text-white" : "text-gray-600"
				}`}>
				<a className="relative flex items-center font-medium rounded-md" href={source}>
					<div className={`h-6 w-6 svg-fit`}>{IconComponent !== null ? <IconComponent /> : <></>}</div>
				</a>
				{hasAlert && <div className={`absolute right-2 w-2 h-2 rounded bg-white top-0`} />}
			</li>
		)
	}

	return (
		<li
			className={`text-black relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ease-in mb-2 group ${
				isActive
					? "bg-gradient-to-tr from-secondary to-primary text-white"
					: "hover:bg-gradient-to-tr hover:from-secondary hover:to-primary hover:opacity-90 hover:text-white text-gray-600"
			}`}>
			<a className="relative flex items-center font-medium rounded-md" href={source}>
				<div className={`h-6 w-6 svg-fit ${isExpand ? "mr-4" : ""}`}>{IconComponent !== null ? <IconComponent /> : <></>}</div>
				<span className={`overflow-hidden transition-all whitespace-nowrap ${isExpand ? "w-52 ml-3" : "w-0"}`}>{text}</span>

				{!isExpand && (
					<div
						className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-primary text-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap`}>
						{text}
					</div>
				)}
			</a>
			{hasAlert && <div className={`absolute right-2 w-2 h-2 rounded bg-white ${isExpand ? "" : "top-2"}`} />}
		</li>
	)
}

export default SidebarItem
