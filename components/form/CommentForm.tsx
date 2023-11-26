"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/navigation"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import ProfilePicture from "../shared/ProfilePicture"
import { NotificationType } from "../notifications/NotificationCard"
import { createCommentSchema } from "@/schemas/Comment"
import { createClient } from "@/utils/supabase/client"
import SubmitButton from "./SubmitButton"

interface Props {
	postId: number
	currentUserImage: string | null
	currentUserId: string
	currentUsername: string
	postProfileId: string | null
}

type CommentFormData = {
	content: string
}

const CommentForm = ({ postId, currentUserImage, currentUserId, currentUsername, postProfileId }: Props) => {
	const supabase = createClient()
	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting, isValid, errors }
	} = useForm<CommentFormData>({
		defaultValues: {
			content: ""
		},
		mode: "onChange",
		resolver: yupResolver(createCommentSchema)
	})

	const onSubmit = async (data: CommentFormData) => {
		try {
			if (data.content.length < 3) {
				throw Error("The content length must be superior to 3.")
			}
			const result = await supabase.auth.getSession()
			if (result.data.session !== null) {
				const profile = await supabase.from("profiles").select("id").eq("user_id", result.data.session.user.id).single()
				if (profile.data !== null) {
					const { data: newPost } = await supabase
						.from("posts")
						.insert({
							content: data.content,
							profile_id: profile.data.id,
							parent_id: postId
						})
						.select("*")
						.single()
					reset()
					if (newPost && postProfileId !== null) {
						await supabase.from("notifications").insert({
							type: NotificationType.Comment,
							profile_id: currentUserId,
							owner_user_id: postProfileId,
							post_id: postId,
							comment_id: newPost.id,
							is_read: false
						})
					}
				}
			}
		} catch (error: any) {
			toast.error(error.message || error || "Veuillez réessayer plus tard.")
		}
	}

	return (
		<form className="flex flex-col gap-2 justify-between h-full text-white" onSubmit={handleSubmit(onSubmit)}>
			<div className="flex items-center gap-4">
				<ProfilePicture avatar_url={currentUserImage} username={currentUsername} />

				<Controller
					name="content"
					control={control}
					render={({ field: { onChange, value } }) => (
						<textarea
							placeholder="Comment..."
							className="w-full h-16 max-sm:h-20 rounded-md bg-slate-900 text-sm p-2  px-4 border-none focus:outline-none resize-none"
							value={value}
							onChange={onChange}
						/>
					)}
				/>

				<SubmitButton className="px-4" isValid={isValid} isSubmitting={isSubmitting} text="Reply" />
			</div>
		</form>
	)
}

export default CommentForm
