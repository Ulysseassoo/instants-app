import { Database } from "./../supabase/database"
export type PostInterface = Database["public"]["Tables"]["posts"]["Row"]

export default PostInterface
