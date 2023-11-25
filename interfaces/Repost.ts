import { Database } from "./../supabase/database"
export type RepostInterface = Database["public"]["Tables"]["reposts"]["Row"]

export default RepostInterface
