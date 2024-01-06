"use client"

import React, { useEffect, useState } from "react"
import PostCard from "../home/PostCard"
import { createClient } from "@/utils/supabase/client"
import { CommentInterfaceWithRelations } from "@/interfaces/Comment"

interface Props {
	comments: CommentInterfaceWithRelations[]
	currentUserId: string
	postId: number
}

const PostCommentsList = ({ comments, currentUserId, postId }: Props) => {
	const supabase = createClient()
	const [postComments, setPostComments] = useState(comments)

	useEffect(() => {
		const channel = supabase
			.channel("commentList")
			.on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, async (payload) => {
				if (payload.new.parent_id !== null && payload.new.parent_id === postId) {
					const { data: post } = await supabase
						.from("posts")
						.select(
							"*, likes!left(*), reposts!left(*), profiles!left(*), communities!left(*), comments:posts!parent_id(*, profiles!left(*), likes!left(*), reposts!left(*), communities!left(*), comments:posts!parent_id(*))"
						)
						.eq("id", payload.new.id)
						.single()

					if (post !== null) {
						setPostComments((comments: any) => [post, ...comments])
					}
				}
			})
			.subscribe()

		return () => {
			supabase.removeChannel(channel)
		}
	}, [postId])

	return (
		<>
			{postComments !== undefined &&
				postComments.map((comment) => (
					<div className="mt-2" key={comment.id}>
						<PostCard
							content={comment.content}
							created_at={comment.created_at}
							id={comment.id}
							profile_id={comment.profile_id}
							currentUserId={currentUserId}
							comments={comment.comments as any}
							communities={comment.communities}
							likes={comment.likes}
							reposts={comment.reposts}
							profiles={comment.profiles as any}
							isComment
						/>
					</div>
				))}
		</>
	)
}

export default PostCommentsList
