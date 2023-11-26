import React from "react"
import { AiFillHeart, AiOutlineComment, AiOutlineRetweet } from "react-icons/ai"
import ProfilePicture from "../shared/ProfilePicture"
import Link from "next/link"
import PostInterface from "@/interfaces/Post"
import ProfileInterface from "@/interfaces/Profile"
import CommentInterface from "@/interfaces/Comment"

export enum NotificationType {
	"Like" = "LIKE",
	"Comment" = "COMMENT",
	"Repost" = "REPOST"
}

interface Props {
	post: PostInterface
	profile: ProfileInterface
	comment: CommentInterface
}

const NotificationCard = ({ type, profile, post, comment, is_read }: Props & any) => {
	if (type === NotificationType.Comment) {
		return (
			<Link href={`post/${post.id}`} className="w-full bg-slate-900 shadow-sm h-fit px-3 py-2 rounded-md relative hover:bg-slate-900/50">
				{!is_read ? <span className="h-3 w-3 absolute -top-1 -right-1 bg-gradient-to-r from-primary via-secondary to-tertiary rounded-full" /> : null}

				<div className="w-full flex items-start gap-3">
					<div className="h-6 w-6 items-center justify-center flex">
						<AiOutlineComment className="text-primary" />
					</div>
					<div className="flex flex-col gap-2">
						<ProfilePicture username={profile.username} avatar_url={profile.avatar_url} classname="h-8 w-8" />
						<div className="flex flex-col gap-0.5">
							<p className="text-sm text-slate-200">
								<span className="font-bold">{profile.full_name}</span> commented your post.
							</p>
							<p className="text-sm text-slate-500">Answering to you:</p>
						</div>
						<p className="text-sm text-slate-500">{comment.content}</p>
					</div>
				</div>
			</Link>
		)
	}
	return (
		<Link href={`post/${post.id}`} className="w-full bg-slate-900 shadow-sm h-fit px-3 py-2 rounded-md relative hover:bg-slate-900/50">
			{!is_read ? <span className="h-3 w-3 absolute -top-1 -right-1 bg-gradient-to-r from-primary via-secondary to-tertiary rounded-full" /> : null}
			<div className="w-full flex items-start gap-3">
				<div className="h-6 w-6 items-center justify-center flex">
					{type === NotificationType.Like && <AiFillHeart className="text-red-500" />}
					{type === NotificationType.Repost && <AiOutlineRetweet className="text-secondary" />}
				</div>
				<div className="flex flex-col gap-2">
					<ProfilePicture username={profile.username} avatar_url={profile.avatar_url} classname="h-8 w-8" />
					<p className="text-sm text-slate-200">
						<span className="font-bold">{profile.full_name}</span> {type === NotificationType.Like ? "liked" : "reposted"} your post.
					</p>
					<p className="text-sm text-slate-500">{post.content}</p>
				</div>
			</div>
		</Link>
	)
}

export default NotificationCard
