"use client"

import React, { useContext } from "react"
import { SidebarContext } from "./SidebarContent"
import { LuCross } from "react-icons/lu"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Props {
	text: string
}

const ButtonSidebar = ({ text }: Props) => {
	const { isExpand } = useContext(SidebarContext)

	return (
		<li
			className={`text-white relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ease-in mb-2 group bg-gradient-to-r from-primary via-secondary to-tertiary`}>
			<Link href="/create-post" className="relative flex items-center font-medium rounded-md">
				<div className={`h-6 w-6 svg-fit ${isExpand ? "mr-4" : ""}`}>
					<LuCross />
				</div>
				<span className={`overflow-hidden transition-all whitespace-nowrap text-start ${isExpand ? "w-52 ml-3" : "w-0"}`}>{text}</span>

				{!isExpand && (
					<div
						className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-primary text-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap`}>
						{text}
					</div>
				)}
			</Link>
		</li>
	)
}

export default ButtonSidebar
