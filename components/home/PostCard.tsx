"use client"

import Link from "next/link"
import React, { useEffect, useState } from "react"
import { AiOutlineComment } from "react-icons/ai"
import ProfilePicture from "../shared/ProfilePicture"
import PostCardLike from "./PostCardLike"
import PostCardRepost from "./PostCardRepost"
import moment from "moment"
import { createClient } from "@/utils/supabase/client"
import { CommentInterfaceWithProfiles } from "@/interfaces/Comment"
import RepostInterface from "@/interfaces/Repost"
import LikeInterface from "@/interfaces/Like"
import PostInterface, { PostInterfaceWithRelations } from "@/interfaces/Post"

interface Props {
	currentProfileId: string
	isComment?: boolean
}

const formatDate = (dateString: string | null) => {
	const formattedDate = moment(dateString).format("hh:mm A")
	return formattedDate
}

const PostCard = ({
	currentProfileId,
	content,
	profile_id,
	profiles,
	id,
	isComment = false,
	comments,
	likes,
	reposts,
	created_at
}: Props & Omit<PostInterfaceWithRelations, "community_id" | "parent_id">) => {
	const supabase = createClient()
	const [postLikes, setPostLikes] = useState<LikeInterface[]>(likes)
	const [postComments, setPostComments] = useState<CommentInterfaceWithProfiles[]>(comments)
	const [postReposts, setPostReposts] = useState<RepostInterface[]>(reposts)

	useEffect(() => {
		const postChannel = supabase
			.channel(`post_${id}`)
			.on("postgres_changes", { event: "*", schema: "public", table: "likes", filter: `post_id=eq.${id}` }, async (payload) => {
				if (payload.eventType === "INSERT") {
					setPostLikes((data: any) => [payload.new, ...data])
				}
				if (payload.eventType === "DELETE") {
					setPostLikes((data) => {
						const newData = data.filter((d) => d.id !== payload.old.id)
						return newData
					})
				}
			})
			.on("postgres_changes", { event: "*", schema: "public", table: "reposts", filter: `post_id=eq.${id}` }, async (payload) => {
				if (payload.eventType === "INSERT") {
					setPostReposts((data: any) => [payload.new, ...data])
				}
				if (payload.eventType === "DELETE") {
					setPostReposts((data) => {
						const newData = data.filter((d) => d.id !== payload.old.id)
						return newData
					})
				}
			})
			.on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, async (payload) => {
				if (payload.new.parent_id === id) {
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
			supabase.removeChannel(postChannel)
		}
	}, [id])

	return (
		<article className={`flex w-full flex-col rounded-xl p-7 ${isComment ? "px-0 xs:px-7 py-0" : "bg-slate-900"}`}>
			<div className="flex items-start justify-between">
				<div className="flex w-full flex-1 flex-row gap-4">
					<div className="flex flex-col items-center">
						<Link href={`/profile/${profile_id}`} className="relative h-11 w-11">
							<ProfilePicture username={profiles.full_name ?? profiles.username} avatar_url={profiles.avatar_url} />
						</Link>

						<div className={`relative w-0.5 grow rounded-full bg-slate-700 ${isComment ? "mt-0" : "mt-2"}`} />

						<div className="mt-1 flex items-center relative select-none">
							{postComments.length > 0 &&
								postComments
									.slice(0, 2)
									.map((comment, index) => (
										<ProfilePicture
											classname={`h-5 w-5 z-${(index + 1) * 10} relative right-${index * 2} text-2xs`}
											username={comment.profiles.username}
											avatar_url={comment.profiles.avatar_url}
											key={comment.id}
										/>
									))}
						</div>
					</div>

					<div className="flex w-full flex-col">
						<Link href={`/profile/${profile_id}`} className="w-fit">
							<h4 className="cursor-pointer font-semibold text-white">{profiles.full_name ?? profiles.username}</h4>
						</Link>

						<p className="m-2 text-sm text-white">{content}</p>

						<div className={`mt-5 flex flex-col gap-3 ${isComment && "mb-6"}`}>
							<div className="flex gap-3.5 text-slate-300">
								<PostCardLike likes={postLikes} postUserId={profile_id} currentProfileId={currentProfileId} postId={id} />
								<Link href={`/post/${id}`} className="h-5 w-5 items-center flex svg-fit cursor-pointer">
									<AiOutlineComment />
								</Link>
								<PostCardRepost reposts={postReposts} postUserId={profile_id} currentProfileId={currentProfileId} postId={id} />
							</div>

							<div className="flex items-center gap-2 select-none">
								{postLikes.length > 0 && <p className="mt-1 text-slate-500 text-md">{postLikes.length} likes</p>}
								{postLikes.length > 0 && postComments.length > 0 && <p className="text-slate-500 text-sm">|</p>}
								{postComments.length > 0 && <p className="mt-1 text-slate-500 text-md">{postComments.length} replies</p>}
								{postComments.length > 0 && postReposts.length > 0 && <p className="text-slate-500 text-sm">|</p>}
								{postReposts.length > 0 && <p className="mt-1 text-slate-500 text-md">{postReposts.length} reposts</p>}
							</div>
						</div>
					</div>
				</div>
			</div>
			<p className="text-sm text-slate-700 mt-2">{formatDate(created_at)}</p>
		</article>
	)
}

export default PostCard
