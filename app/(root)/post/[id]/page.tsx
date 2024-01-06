import CommentForm from "@/components/form/CommentForm"
import PostCard from "@/components/home/PostCard"
import PostCommentsList from "@/components/post/PostCommentsList"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import React from "react"

interface Params {
	params: {
		id: string
	}
}

export const revalidate = 0

const Post = async ({ params }: Params) => {
	if (!params.id) return null
	const cookiesStore = cookies()
	const supabase = createClient(cookiesStore)
	const {
		data: { session }
	} = await supabase.auth.getSession()

	if (!session) {
		redirect("/login")
	}

	const { data } = await supabase.from("profiles").select("*").eq("user_id", session?.user.id).single()

	if (!data) {
		redirect("/login")
	}

	if (!data.full_name) {
		redirect("/onboarding")
	}

	const { data: post } = await supabase
		.from("posts")
		.select(
			"*, likes!left(*), reposts!left(*), profiles!left(*), communities!left(*), comments:posts!parent_id(*, profiles!left(*), likes!left(*), reposts!left(*), communities!left(*), comments:posts!parent_id(*, profiles!left(*)))"
		)
		.eq("id", params.id)
		.single()

	if (!post) return null

	return (
		<section className="relative mt-9">
			<div>
				<PostCard
					key={post.id}
					content={post.content}
					created_at={post.created_at}
					id={post.id}
					profile_id={post.profile_id}
					currentProfileId={data.id}
					comments={post.comments as any}
					communities={post.communities}
					likes={post.likes}
					reposts={post.reposts}
					profiles={post.profiles as any}
				/>
			</div>

			<div className="mt-7">
				<CommentForm
					currentUsername={data.username}
					postProfileId={post.profile_id}
					postId={post.id}
					currentUserImage={data.avatar_url}
					currentUserId={data.id}
				/>
			</div>

			<div className="mt-10">
				<PostCommentsList comments={post.comments as any} currentUserId={data.id} postId={post.id} />
			</div>
		</section>
	)
}

export default Post
