"use client"

import React, { useEffect, useState } from "react"
import PostCard from "./PostCard"
import { createClient } from "@/utils/supabase/client"

interface Props {
	currentProfileId: string
	serverPosts: any[] | null
}

const RealtimePosts = ({ serverPosts, currentProfileId }: Props) => {
	const supabase = createClient()
	const [posts, setPosts] = useState(serverPosts)

	useEffect(() => {
		setPosts(serverPosts)
	}, [serverPosts])

	useEffect(() => {
		const channel = supabase
			.channel("*")
			.on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, async (payload) => {
				const { data: post } = await supabase
					.from("posts")
					.select(
						"*, likes!left(*), reposts!left(*), profiles!left(*), communities!left(*), comments:posts!parent_id(*, profiles!left(*), likes!left(*), reposts!left(*), communities!left(*), comments:posts!parent_id(*))"
					)
					.eq("id", payload.new.id)
					.single()

				if (post !== null && post.parent_id === null) {
					setPosts((posts: any) => [post, ...posts])
				}
			})
			.subscribe()

		return () => {
			supabase.removeChannel(channel)
		}
	}, [serverPosts])
	return (
		<>
			{posts && posts.length > 0 ? (
				<>
					{posts.map((post) => (
						<PostCard
							key={post.id}
							content={post.content}
							created_at={post.created_at}
							id={post.id}
							profile_id={post.profile_id}
							currentProfileId={currentProfileId}
							comments={post.comments}
							communities={post.communities}
							likes={post.likes}
							reposts={post.reposts}
							profiles={post.profiles as any}
						/>
					))}
				</>
			) : (
				<p className="text-slate-400">No posts found</p>
			)}
		</>
	)
}

export default RealtimePosts
