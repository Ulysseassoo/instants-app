import { Database } from "./../supabase/database"
export type CommunitiesInterface = Database["public"]["Tables"]["communities"]["Row"]

export default CommunitiesInterface
