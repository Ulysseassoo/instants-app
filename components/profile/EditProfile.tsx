"use client"

import React, { useState } from "react"
import Modal from "../shared/Modal"
import AccountProfile from "../onboarding/AccountProfile"
import { MdClose } from "react-icons/md"

interface Props {
	currentUserId: string
	profile: {
		avatar_url: string | null
		biography: string | null
		created_at: string | null
		full_name: string | null
		id: string
		user_id: string
		username: string
	}
}

const EditProfile = ({ currentUserId, profile }: Props) => {
	const [showModal, setShowModal] = useState(false)

	const getBack = () => {
		setShowModal(false)
		document.documentElement.style.overflow = "scroll"
	}

	return (
		<>
			{currentUserId === profile.user_id && (
				<button
					className={`cursor-pointer text-sm p-0 w-fit flex items-center justify-center text-white rounded-md overflow-hidden bg-slate-900 border-2 border-slate-700 shadow-sm`}
					type="button"
					onClick={() => {
						setShowModal(true)
						document.documentElement.style.overflow = "hidden"
					}}>
					<span className="block p-2 text-white">Edit Profile</span>
				</button>
			)}

			{showModal ? (
				<Modal getBack={() => {}} modalClass="overflow-auto h-3/4 py-0 !important" isAnotherButton>
					<div className="px-4 h-16 w-full bg-slate-900/80 backdrop-blur-md items-center justify-between flex sticky top-0 left-0 z-20">
						<h2 className="text-md max-sm:text-sm mb-6 pt-2">Edit Profile</h2>
						<button type="button" onClick={getBack} className="h-10 w-10 absolute top-3 right-4 cursor-pointer ">
							<MdClose />
						</button>
					</div>
					<div className="py-4 px-4 text-sm">
						<AccountProfile user={profile} submitText="Update" afterSuccess={getBack} />
					</div>
				</Modal>
			) : (
				<></>
			)}
		</>
	)
}

export default EditProfile
