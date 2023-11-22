import DeployButton from "../../components/DeployButton"
import AuthButton from "../../components/AuthButton"
import { createClient } from "@/utils/supabase/server"
import ConnectSupabaseSteps from "@/components/ConnectSupabaseSteps"
import SignUpUserSteps from "@/components/SignUpUserSteps"
import Header from "@/components/Header"
import { cookies } from "next/headers"

export default async function Index() {
	return <>Hi</>
}
