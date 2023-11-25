import { Database } from "./../supabase/database"
import ProfileInterface from "./Profile"
export type CommentInterface = Database["public"]["Tables"]["posts"]["Row"]
export type CommentInterfaceWithProfiles = CommentInterface & {
	profiles: ProfileInterface
}

export default CommentInterface
