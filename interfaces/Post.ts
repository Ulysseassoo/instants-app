import { Database } from "./../supabase/database"
import { CommentInterfaceWithProfiles } from "./Comment"
import CommunitiesInterface from "./Community"
import LikeInterface from "./Like"
import ProfileInterface from "./Profile"
import RepostInterface from "./Repost"
export type PostInterface = Database["public"]["Tables"]["posts"]["Row"]

export type PostInterfaceWithRelations = PostInterface & {
	comments: CommentInterfaceWithProfiles[]
	likes: LikeInterface[]
	reposts: RepostInterface[]
	profiles: ProfileInterface
	communities: CommunitiesInterface[]
}

export default PostInterface
