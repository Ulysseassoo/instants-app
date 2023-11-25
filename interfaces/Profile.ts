import { Database } from "./../supabase/database"
export type ProfileInterface = Database["public"]["Tables"]["profiles"]["Row"]

export default ProfileInterface
