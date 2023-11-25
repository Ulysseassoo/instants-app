"use client"

import PostForm from "@/components/modal/PostForm"
import Modal from "@/components/shared/Modal"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

const CreatePost = () => {
	const router = useRouter()
	useEffect(() => {
		document.documentElement.style.overflow = "hidden"
	}, [])

	return (
		<Modal
			getBack={() => {
				router.back()
				document.documentElement.style.overflow = "scroll"
			}}
			modalClass="py-4 px-4">
			<PostForm />
		</Modal>
	)
}

export default CreatePost
