import React from "react"
import PostCard from "../home/PostCard"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

interface Props {
	currentUserId: string
	profileUserId: string
}

const ReplyTab = async ({ currentUserId, profileUserId }: Props) => {
	const cookiesStore = cookies()
	const supabase = createClient(cookiesStore)

	const { data } = await supabase
		.from("reposts")
		.select(
			"post:posts(*, likes!left(*), reposts!left(*), profiles!left(*), communities!left(*), comments:posts!parent_id(*, profiles!left(*), likes!left(*), reposts!left(*), communities!left(*), comments:posts!parent_id(*)))"
		)
		.eq("profile_id", profileUserId)
		.order("created_at", {
			ascending: false
		})

	if (!data) redirect("/")

	return (
		<section className="mt-9 flex flex-col gap-10">
			{data.map(({ post }) => {
				if (!post) {
					return <></>
				}
				return (
					<PostCard
						key={post.id}
						content={post.content}
						created_at={post.created_at}
						id={post.id}
						profile_id={post.profile_id}
						currentProfileId={currentUserId}
						comments={post.comments as any}
						communities={post.communities}
						likes={post.likes}
						reposts={post.reposts}
						profiles={post.profiles as any}
					/>
				)
			})}
		</section>
	)
}

export default ReplyTab
