"use client"

import React, { useEffect, useState } from "react"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { toast } from "react-toastify"
import { NotificationType } from "../notifications/NotificationCard"
import { createClient } from "@/utils/supabase/client"

interface Props {
	postId: number
	likes: any[]
	currentUserId: string
	postUserId: string
}

const PostCardLike = ({ postId, likes, currentUserId, postUserId }: Props) => {
	const supabase = createClient()
	const isLiked = likes.find((like) => like.user_id === currentUserId)
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
							user_id: profile.data.id,
							post_id: postId
						})
						await supabase.from("notifications").insert({
							type: NotificationType.Like,
							user_id: currentUserId,
							owner_user_id: postUserId,
							post_id: postId
						})
					} else {
						if (isLiked !== undefined) {
							await supabase.from("likes").delete().eq("id", isLiked.id)
							await supabase
								.from("notifications")
								.delete()
								.eq("post_id", postId)
								.eq("user_id", currentUserId)
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
