"use client"

import React, { useEffect, useState } from "react"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { toast } from "react-toastify"
import { NotificationType } from "../notifications/NotificationCard"
import { createClient } from "@/utils/supabase/client"
import LikeInterface from "@/interfaces/Like"

interface Props {
	postId: number
	likes: LikeInterface[]
	currentProfileId: string
	postUserId: string
}

const PostCardLike = ({ postId, likes, currentProfileId, postUserId }: Props) => {
	const supabase = createClient()
	const isLiked = likes.find((like) => like.profile_id === currentProfileId)
	const [postIsLiked, setPostIsLiked] = useState(Boolean(isLiked))

	const toggleLike = async () => {
		try {
			setPostIsLiked(!postIsLiked)
			const session = await supabase.auth.getSession()
			if (session.data?.session !== null) {
				const profile = await supabase.from("profiles").select("id").eq("user_id", session.data.session.user.id).single()

				if (profile.data !== null) {
					if (!postIsLiked) {
						await supabase.from("likes").insert({
							profile_id: profile.data.id,
							post_id: postId
						})
						await supabase.from("notifications").insert({
							type: NotificationType.Like,
							profile_id: currentProfileId,
							owner_user_id: postUserId,
							post_id: postId,
							is_read: false
						})
					} else {
						if (isLiked !== undefined) {
							await supabase.from("likes").delete().eq("id", isLiked.id)
							await supabase
								.from("notifications")
								.delete()
								.eq("post_id", postId)
								.eq("profile_id", currentProfileId)
								.eq("type", NotificationType.Like)
								.eq("owner_user_id", postUserId)
						}
					}
				}
			}
		} catch (error: any) {
			setPostIsLiked(!postIsLiked)
			toast.error(error.message || error)
		}
	}

	return (
		<button className="h-5 w-5 items-center flex svg-fit cursor-pointer" type="button" onClick={toggleLike}>
			{postIsLiked ? <AiFillHeart /> : <AiOutlineHeart />}
		</button>
	)
}

export default PostCardLike
