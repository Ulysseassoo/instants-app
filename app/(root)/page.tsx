import PostCard from "@/components/home/PostCard"
import RealtimePosts from "@/components/home/RealtimePosts"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const revalidate = 0

export default async function Home() {
	const cookiesStore = cookies()
	const supabse = createClient(cookiesStore)
	const {
		data: { session }
	} = await supabse.auth.getSession()

	if (!session) {
		redirect("/login")
	}

	const { data } = await supabse.from("profiles").select("*").eq("user_id", session?.user.id).single()

	const { data: posts } = await supabse
		.from("posts")
		.select(
			"*, likes!left(*), reposts!left(*), profiles!left(*), communities!left(*), comments:posts!parent_id(*, profiles!left(*), likes!left(*), reposts!left(*), communities!left(*), comments:posts!parent_id(*))"
		)
		.limit(20)
		.order("created_at", {
			ascending: false
		})
		.is("parent_id", null)

	return (
		<div className="h-screen w-full">
			<div className="mt-9 flex flex-col gap-10">
				<RealtimePosts serverPosts={posts as any} currentUserId={data.id} />
			</div>
		</div>
	)
}
