import Image from "next/image"
import React from "react"

interface Props {
	avatar_url: string | null
	username: string
	classname?: string
}

const ProfilePicture = ({ avatar_url, username, classname }: Props) => {
	return (
		<>
			{avatar_url !== null ? (
				<Image
					className={`inline-block rounded-full border-white border-2 ${classname ? classname : " h-10 w-10"}`}
					src={avatar_url}
					alt={`${username} profile picture`}
					width={200}
					height={200}
					style={{
						objectFit: "cover"
					}}
				/>
			) : (
				<div className={`rounded-full border-white border-2 flex items-center justify-center bg-slate-900 ${classname ? classname : " h-10 w-10"}`}>
					<p className="text-md text-white font-bold flex items-center justify-center">{username[0]}</p>
				</div>
			)}
		</>
	)
}

export default ProfilePicture
