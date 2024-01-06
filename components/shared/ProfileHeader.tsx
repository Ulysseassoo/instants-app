"use client"

import React, { useEffect, useState } from "react"
import ProfilePicture from "./ProfilePicture"
import { AiOutlineCalendar } from "react-icons/ai"
import moment from "moment"
import { LuMessageSquare } from "react-icons/lu"
import { Database } from "@/supabase/database"
import { createClient } from "@/utils/supabase/client"
import EditProfile from "../profile/EditProfile"

interface Props {
	currentUserId: string
	profile: Database["public"]["Tables"]["profiles"]["Row"]
}

const formatDate = (date: string | null) => {
	moment.locale("fr")
	if (date !== null) {
		const parsedDate = moment(new Date(date).toISOString())
		const formattedDate = parsedDate.format("MMMM YYYY")

		return `Joined Instants in ${formattedDate}`
	}

	return ""
}

const ProfileHeader = ({ currentUserId, profile }: Props) => {
	const supabase = createClient()
	const [updatedProfile, setUpdatedProfile] = useState(profile)

	useEffect(() => {
		const channel = supabase
			.channel("*")
			.on<Database["public"]["Tables"]["profiles"]["Row"]>(
				"postgres_changes",
				{ event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${profile.id}` },
				async (payload) => {
					setUpdatedProfile(payload.new)
				}
			)
			.subscribe()

		return () => {
			supabase.removeChannel(channel)
		}
	}, [profile.id])

	return (
		<div className="flex w-full flex-col justify-start">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="relative h-20 w-20 object-cover">
						<ProfilePicture
							avatar_url={updatedProfile.avatar_url}
							classname="rounded-full object-cover shadow-2xl"
							username={updatedProfile.username}
						/>
					</div>

					<div className="flex-1">
						<h2 className="text-left font-bold text-lg">{updatedProfile.full_name}</h2>
						<p className="text-md text-slate-400">@{updatedProfile.username}</p>
					</div>
				</div>

				{currentUserId !== profile.user_id ? (
					<div className="flex items-center gap-1">
						<button
							className={`cursor-pointer text-xl p-2 w-fit flex items-center justify-center text-white rounded-md overflow-hidden bg-slate-900 border-2 border-slate-700 shadow-sm`}
							type="button">
							<LuMessageSquare />
						</button>

						<button
							className={`cursor-pointer text-sm px-3 py-2 w-fit flex items-center justify-center text-slate-800 rounded-md overflow-hidden bg-white border-2 border-slate-700 shadow-sm hover:bg-gray-300`}
							type="button">
							Follow
						</button>
					</div>
				) : null}
				<EditProfile currentUserId={currentUserId} profile={updatedProfile} />
			</div>

			<p className="mt-6 max-w-lg text-md text-slate-300">{updatedProfile.biography}</p>
			<p className="flex text-sm mt-2 text-slate-400 items-center gap-1">
				<AiOutlineCalendar /> {formatDate(updatedProfile.created_at)}
			</p>

			<div className="mt-4 max-w-lg text-sm text-slate-300 flex items-center gap-1">
				<p>
					<span className="text-white font-bold">0</span> followers
				</p>
				<p>
					<span className="text-white font-bold">0</span> following
				</p>
			</div>

			<div className="mt-12 h-0 5 w-full bg-slate-600"></div>
		</div>
	)
}

export default ProfileHeader
