"use client"

import React, { useRef, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { userInformationsSchema } from "@/schemas/User"
import { yupResolver } from "@hookform/resolvers/yup"
import { TbPencil, TbUser } from "react-icons/tb"
import FormInput from "../form/FormInput"
import { toast } from "react-toastify"
import Image from "next/image"
import { AiOutlinePicture } from "react-icons/ai"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

interface Props {
	user: any
	submitText?: string
	afterSuccess?: () => void
}

type UserFormData = {
	username: string
	biography: string
	avatar_url: string
	full_name: string
}

const AccountProfile = ({ user, submitText, afterSuccess }: Props) => {
	const router = useRouter()
	const supabase = createClient()
	const imageRef = useRef<HTMLInputElement | null>(null)
	const [selectedImage, setSelectedImage] = useState<File | null>(null)
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<UserFormData>({
		defaultValues: {
			username: user.username,
			biography: user.biography ?? "",
			avatar_url: user.avatar_url ?? "",
			full_name: user.full_name ?? ""
		},
		mode: "onChange",
		resolver: yupResolver(userInformationsSchema)
	})

	const uploadImage = async (file: File) => {
		const fileExt = file.name.split(".").pop()
		const fileName = `${Math.random()}.${fileExt}`
		const filePath = `${fileName}`

		try {
			const { error: uploadError, data: imageData } = await supabase.storage.from("avatars").upload(filePath, file, {
				contentType: `image/${fileExt}`
			})

			if (uploadError) {
				throw uploadError
			}

			const avatar_url = imageData?.path
			const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(avatar_url)
			return urlData.publicUrl
		} catch (error: any) {
			toast.error(error.error_description || error.message)
		}
	}

	const onSubmitForm = async (formData: UserFormData) => {
		try {
			let image: string | undefined = undefined
			if (selectedImage !== null) {
				image = await uploadImage(selectedImage)
			}

			const updates = {
				id: user.id,
				user_id: user.user_id,
				avatar_url: image !== undefined ? image : formData.avatar_url,
				username: formData.username,
				biography: formData.biography,
				full_name: formData.full_name
			}

			const { error } = await supabase.from("profiles").upsert(updates)

			if (error) throw error

			if (afterSuccess) {
				afterSuccess()
			} else {
				await supabase.auth.updateUser({
					data: {
						has_profile: true
					}
				})
				router.push("/")
			}
		} catch (error: any) {
			toast.error(error.message || "Veuillez réessayer plus tard.")
		}
	}

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
		const { files } = event.target

		if (files !== null && files.length > 0) {
			const file = files[0]
			const reader = new FileReader()
			reader.onload = () => {
				setSelectedImage(file)
				onChange(reader.result)
			}
			reader.readAsDataURL(file)
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col space-y-4">
			<Controller
				control={control}
				render={({ field: { onChange, value } }) => (
					<div className={`form-control flex flex-center gap-4 flex-col`}>
						<div className="flex justify-between w-full max-md:flex-col">
							<label className="block mb-2">Profile picture</label>
							<button
								type="button"
								onClick={() => {
									if (imageRef.current !== null) {
										imageRef.current.click()
									}
								}}
								className="bg-slate-900 py-1 px-3 flex items-center gap-2 text-sm rounded-md hover:opacity-60">
								<AiOutlinePicture />
								<span>Choose an image</span>
							</button>
						</div>
						<div>
							{value ? (
								<Image src={value} alt="profile photo" width={96} height={96} priority className="rounded-full object-cover h-20 w-20" />
							) : (
								<div className="inline-block h-20 w-20 rounded-full border-white border-2 flex items-center justify-center">
									<p className="text-md text-white font-bold">{user.username[0]}</p>
								</div>
							)}
						</div>
						<input
							className="hidden"
							id="image-input"
							ref={imageRef}
							accept="image/jpeg, image/png"
							type="file"
							onChange={(e) => handleImageChange(e, onChange)}
						/>
						<p className="text-slate-500 my-1.5">This is your public profile picture.</p>
					</div>
				)}
				name="avatar_url"
			/>

			<Controller
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<FormInput
						label="Name"
						placeholder="Your full name"
						IconName={TbPencil}
						errorMessage={errors.full_name?.message}
						value={value}
						onChange={onChange}
						onBlur={onBlur}
					/>
				)}
				name="full_name"
			/>

			<Controller
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<FormInput
						label="Username"
						placeholder="Your username"
						IconName={TbUser}
						errorMessage={errors.username?.message}
						value={value}
						onChange={onChange}
						onBlur={onBlur}
						helperText="This is your public display name."
					/>
				)}
				name="username"
			/>

			<Controller
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<FormInput
						label="Bio"
						placeholder="Write whatever you want"
						errorMessage={errors.biography?.message}
						value={value}
						onChange={onChange}
						onBlur={onBlur}
						isTextArea
						helperText="This is a bio that will be shown on your profile."
					/>
				)}
				name="biography"
			/>

			<button
				className="mt-4 p-0 w-full flex items-center justify-center text-white rounded-md overflow-hidden bg-gradient-to-r from-primary via-secondary to-tertiary"
				type="submit"
				disabled={isSubmitting}>
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
				<span className="block p-2 text-white">{submitText ? submitText : "Continue"}</span>
			</button>
		</form>
	)
}

export default AccountProfile
