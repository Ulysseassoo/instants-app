"use client"

import { createPostSchema } from "@/schemas/Post"
import { createClient } from "@/utils/supabase/client"
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/navigation"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import { AiOutlinePicture } from "react-icons/ai"
import { toast } from "react-toastify"

type PostFormData = {
	content: string
}

const PostForm = () => {
	const router = useRouter()
	const supabase = createClient()
	const circumference = 13 * 2 * Math.PI
	const {
		control,
		handleSubmit,
		watch,
		reset,
		formState: { isSubmitting, isValid, errors }
	} = useForm<PostFormData>({
		defaultValues: {
			content: ""
		},
		mode: "all",
		resolver: yupResolver(createPostSchema)
	})

	const content = watch("content")
	const wordLimit = 280
	const watchContentLength = circumference - (content.length / wordLimit) * circumference

	const onSubmit = async (data: PostFormData) => {
		try {
			if (data.content.length < 1) {
				throw Error("The content length must be superior to 1.")
			}
			const result = await supabase.auth.getSession()
			if (result.data.session !== null) {
				const profile = await supabase.from("profiles").select("id").eq("user_id", result.data.session.user.id).single()
				if (profile.data !== null) {
					await supabase.from("posts").insert({
						content: data.content,
						user_id: profile.data.id
					})
					reset()
					document.documentElement.style.overflow = "scroll"
					router.back()
				}
			}
		} catch (error: any) {
			toast.error(error.message || "Veuillez réessayer plus tard.")
		}
	}

	return (
		<form className="flex flex-col gap-2 justify-between h-full text-white" onSubmit={handleSubmit(onSubmit)}>
			<Controller
				name="content"
				control={control}
				render={({ field: { onChange, value } }) => (
					<textarea
						placeholder="What's up ?!"
						className="w-full mt-4 h-full rounded-md bg-slate-900 text-sm p-2 border-none focus:outline-none resize-none"
						value={value}
						onChange={onChange}
					/>
				)}
			/>

			<hr className="border-slate-800" />

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="svg-fit flex items-center justify-center h-6 w-6 text-white">
						<AiOutlinePicture />
					</div>
				</div>
				<div className="flex w-fit items-center gap-4">
					<div className="flex items-center relative justify-center">
						<svg className="progress">
							<circle className="progress-background" cx="15" cy="15" r="13" />
							<circle
								className={`progress-bar ${watchContentLength <= 0 ? "stroke-red-500" : "stroke-secondary"}`}
								cx="15"
								cy="15"
								r="13"
								strokeDasharray={circumference}
								strokeDashoffset={watchContentLength <= 0 ? 0 : watchContentLength}
							/>
						</svg>
						<p className="text-2xs absolute">{wordLimit - content.length}</p>
					</div>
					<hr className="bg-slate-800 w-px h-8" />
					<button
						className="cursor-pointer text-sm p-0 w-fit flex items-center justify-center text-white rounded-md overflow-hidden bg-gradient-to-r from-primary via-secondary to-tertiary disabled:opacity-30 disabled:cursor-default"
						type="submit"
						disabled={!isValid || isSubmitting}>
						{isSubmitting && (
							<div className="grid grid-rows-1 grid-cols-1 place-items-center">
								<svg width="25px" height="25px" className="animate-spin grid-center" viewBox="0 0 24 24">
									<g>
										<path fill="none" d="M0 0h24v24H0z" />
										<path fill="#fff" d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z" />
									</g>
								</svg>
							</div>
						)}
						<span className="block p-2 text-white">Post it</span>
					</button>
				</div>
			</div>
		</form>
	)
}

export default PostForm
