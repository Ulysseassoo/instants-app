import React, { Suspense } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ProfileHeader from "@/components/shared/ProfileHeader"
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs"
import { profileTabs } from "@/constants"
import PostTab from "@/components/shared/PostTab"
import ReplyTab from "@/components/shared/ReplyTab"
import LoadingPost from "@/components/LoadingPost"
import { createClient } from "@/utils/supabase/server"

export const revalidate = 0

const Profile = async ({ params }: { params: { id: string } }) => {
	const cookiesStore = cookies()
	const supabase = createClient(cookiesStore)
	const {
		data: { session }
	} = await supabase.auth.getSession()

	if (!session) {
		redirect("/login")
	}

	const { data } = await supabase.from("profiles").select("*").eq("id", params.id).single()
	const { count } = await supabase.from("posts").select("*", { count: "exact", head: true }).eq("profile_id", params.id)
	const { count: repliesCount } = await supabase.from("reposts").select("*", { count: "exact", head: true }).eq("profile_id", params.id)

	if (!data) {
		redirect("/login")
	}

	if (!data.full_name) {
		redirect("/onboarding")
	}

	return (
		<section className="mt-6">
			<ProfileHeader currentUserId={session.user.id} profile={data} />

			<div className="mt-9">
				<Tabs defaultValue="posts" className="w-full">
					<TabsList className="flex min-h-[50px] flex-1 items-center gap-3 bg-slate-900 px-0 text-slate-400 data-[state=active]:bg-slate-700 data-[state=active]:text-slate-300 !important">
						{profileTabs.map((tab) => (
							<TabsTrigger
								key={tab.label}
								value={tab.name}
								className="flex min-h-[50px] flex-1 items-center gap-3 bg-slate-900 text-slate-400 data-[state=active]:bg-slate-700 data-[state=active]:text-slate-300 !important">
								<div className="h-5 w-5 items-center flex svg-fit cursor-pointer">
									<tab.Icon />
								</div>
								<p className="max-sm:hidden">{tab.label}</p>
								{tab.label === "Posts" && (
									<p className="ml-1 rounded-full bg-slate-800 px-2 py-0.5 text-sm text-slate-300 flex items-center justify-center">{count}</p>
								)}
								{tab.label === "Reposts" && (
									<p className="ml-1 rounded-full bg-slate-800 px-2 py-0.5 text-sm text-slate-300 flex items-center justify-center">{repliesCount}</p>
								)}
							</TabsTrigger>
						))}
					</TabsList>
					{profileTabs.map((tab) => (
						<TabsContent key={`content-${tab.label}`} value={tab.name}>
							<Suspense fallback={<LoadingPost />}>
								{tab.name === "posts" && <PostTab currentUserId={data.id} profileUserId={data.id} />}
								{tab.name === "replies" && <ReplyTab currentUserId={data.id} profileUserId={data.id} />}
							</Suspense>
						</TabsContent>
					))}
				</Tabs>
			</div>
		</section>
	)
}

export default Profile
