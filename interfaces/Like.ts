import { Database } from "./../supabase/database"
export type LikeInterface = Database["public"]["Tables"]["likes"]["Row"]

export default LikeInterface
