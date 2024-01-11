"use client"

import React, { useEffect, useState } from "react"
import ProfilePicture from "./ProfilePicture"
import { AiOutlineCalendar } from "react-icons/ai"
import moment from "moment"
import { LuMessageSquare } from "react-icons/lu"
import { Database } from "@/supabase/database"
import { createClient } from "@/utils/supabase/client"
import EditProfile from "../profile/EditProfile"
import useAuthStore from "@/store/authStore"

interface Props {
	profile: Database["public"]["Tables"]["profiles"]["Row"]
	followersList: Database["public"]["Tables"]["followers"]["Row"][]
	followingList: Database["public"]["Tables"]["followers"]["Row"][]
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

const ProfileHeader = ({ profile, followersList, followingList }: Props) => {
	const supabase = createClient()
	const [updatedProfile, setUpdatedProfile] = useState(profile)
	const { profile: currentProfile } = useAuthStore((state) => state)
	const [followers, setFollowers] = useState<Database["public"]["Tables"]["followers"]["Row"][]>(followersList)
	const followersCount = followersList.length
	const followingCount = followingList.length
	const checkIfFollowing = followersList.some((f) => f.follower_id === currentProfile?.id)

	useEffect(() => {
		const channel = supabase
			.channel(`profile-${profile.id}}`)
			.on<Database["public"]["Tables"]["profiles"]["Row"]>(
				"postgres_changes",
				{ event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${profile.id}` },
				async (payload) => {
					setUpdatedProfile(payload.new)
				}
			)
			.subscribe()

		const channelFollowers = supabase
			.channel(`profile-followers-${profile.id}}`)
			.on<Database["public"]["Tables"]["followers"]["Row"]>(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "followers", filter: `profile_id=eq.${profile.id}` },
				async (payload) => {
					setFollowers((list) => [...list, payload.new])
				}
			)
			.on<Database["public"]["Tables"]["followers"]["Row"]>(
				"postgres_changes",
				{ event: "DELETE", schema: "public", table: "followers", filter: `profile_id=eq.${profile.id}` },
				async (payload) => {
					setFollowers((list) => list.filter((f) => f.follower_id !== payload.old.follower_id))
				}
			)
			.subscribe()

		return () => {
			supabase.removeChannel(channel)
			supabase.removeChannel(channelFollowers)
		}
	}, [profile.id])

	const updateFollower = async () => {
		if (currentProfile !== null) {
			if (checkIfFollowing) {
				const { error } = await supabase.from("followers").delete().match({ profile_id: profile.id, follower_id: currentProfile.id })

				if (error) {
					console.log(error)
				}
			} else {
				const { error } = await supabase.from("followers").upsert({
					profile_id: profile.id,
					follower_id: currentProfile.id
				})

				if (error) {
					console.log(error)
				}
			}
		}
	}

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

				{currentProfile !== null && currentProfile.id !== profile.id ? (
					<div className="flex items-center gap-1">
						<button
							className={`cursor-pointer text-xl p-2 w-fit flex items-center justify-center text-white rounded-md overflow-hidden bg-slate-900 border-2 border-slate-700 shadow-sm`}
							type="button">
							<LuMessageSquare />
						</button>

						<button
							className={`cursor-pointer text-sm px-3 py-2 w-fit flex items-center justify-center text-slate-800 rounded-md overflow-hidden bg-white border-2 border-slate-700 shadow-sm hover:bg-gray-300`}
							type="button"
							onClick={updateFollower}>
							{checkIfFollowing ? "Unfollow" : "Follow"}
						</button>
					</div>
				) : null}
				<EditProfile profile={updatedProfile} />
			</div>

			<p className="mt-6 max-w-lg text-md text-slate-300">{updatedProfile.biography}</p>
			<p className="flex text-sm mt-2 text-slate-400 items-center gap-1">
				<AiOutlineCalendar /> {formatDate(updatedProfile.created_at)}
			</p>

			<div className="mt-4 max-w-lg text-sm text-slate-300 flex items-center gap-1">
				<p>
					<span className="text-white font-bold">{followersCount}</span> followers
				</p>
				<p>
					<span className="text-white font-bold">{followingCount}</span> following
				</p>
			</div>

			<div className="mt-12 h-0 5 w-full bg-slate-600"></div>
		</div>
	)
}

export default ProfileHeader
