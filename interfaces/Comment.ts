import { Database } from "./../supabase/database"
import CommunitiesInterface from "./Community"
import LikeInterface from "./Like"
import ProfileInterface from "./Profile"
import RepostInterface from "./Repost"
export type CommentInterface = Database["public"]["Tables"]["posts"]["Row"]
export type CommentInterfaceWithProfiles = CommentInterface & {
	profiles: ProfileInterface
}

export type CommentInterfaceWithRelations = CommentInterface & {
	comments: Database["public"]["Tables"]["posts"]["Row"]
	likes: LikeInterface[]
	reposts: RepostInterface[]
	profiles: ProfileInterface[]
	communities: CommunitiesInterface[]
}

export default CommentInterface
