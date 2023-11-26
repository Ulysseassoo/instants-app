"use client"

import React from "react"
import ProfilePicture from "../shared/ProfilePicture"
import Link from "next/link"
import ProfileInterface from "@/interfaces/Profile"

const UserCard = ({ username, avatar_url, id, full_name }: ProfileInterface) => {
	return (
		<article className="flex items-center justify-between bg-slate-900 shadow-sm py-3 px-4 rounded-md">
			<div className="flex items-center gap-3">
				<ProfilePicture username={username} avatar_url={avatar_url} />

				<div className="flex-1 text-ellipsis">
					<h4 className="font-semibold text-slate-300">{full_name}</h4>
					<p className="text-sm text-slate-500">@{username}</p>
				</div>
			</div>
			<Link
				className="cursor-pointer text-sm px-2 py-1 w-fit flex items-center justify-center text-white rounded-md overflow-hidden bg-gradient-to-r from-primary via-secondary to-tertiary disabled:opacity-30 disabled:cursor-default"
				href={`/profile/${id}`}>
				View
			</Link>
		</article>
	)
}

export default UserCard
