"use client"

import React, { useState } from "react"
import { AiOutlineRetweet } from "react-icons/ai"
import { toast } from "react-toastify"
import { createClient } from "@/utils/supabase/client"
import { NotificationType } from "../notifications/NotificationCard"

interface Props {
	postId: number
	reposts: any[]
	currentUserId: string
	postUserId: string
}

const PostCardRepost = ({ reposts, currentUserId, postId, postUserId }: Props) => {
	const supabase = createClient()
	const isReposted = reposts.find((repost) => repost.user_id === currentUserId)
	const [postIsReposted, setPostIsReposted] = useState(Boolean(isReposted))

	const toggleRepost = async () => {
		try {
			setPostIsReposted(!postIsReposted)
			const session = await supabase.auth.getSession()
			if (session.data?.session !== null) {
				const profile = await supabase.from("profiles").select("id").eq("user_id", session.data.session.user.id).single()

				if (profile.data !== null) {
					if (!postIsReposted) {
						const { error } = await supabase.from("reposts").insert({
							user_id: profile.data.id,
							post_id: postId,
							repost_date: new Date().toDateString()
						})

						if (error) throw Error(error.message)

						await supabase.from("notifications").insert({
							type: NotificationType.Repost,
							user_id: currentUserId,
							owner_user_id: postUserId,
							post_id: postId
						})
					} else {
						if (isReposted !== undefined) {
							await supabase.from("reposts").delete().eq("id", isReposted.id)
							await supabase
								.from("notifications")
								.delete()
								.eq("post_id", postId)
								.eq("user_id", currentUserId)
								.eq("type", NotificationType.Repost)
								.eq("owner_user_id", postUserId)
						}
					}
				}
			}
		} catch (error: any) {
			setPostIsReposted(!postIsReposted)
			toast.error(error.message || error)
		}
	}

	return (
		<button
			className={`h-5 w-5 items-center flex svg-fit cursor-pointer ${postIsReposted ? "text-secondary" : ""}`}
			type="button"
			onClick={toggleRepost}>
			<AiOutlineRetweet />
		</button>
	)
}

export default PostCardRepost
