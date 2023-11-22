import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import React from "react"

interface Props {
	children: React.ReactNode
}

const BottomBar = async ({ children }: Props) => {
	const cookiesStore = cookies()
	const supabase = createClient(cookiesStore)
	const {
		data: { session }
	} = await supabase.auth.getSession()

	if (!session) return <> </>

	const { data } = await supabase.from("profiles").select("*").eq("user_id", session?.user.id).single()

	if (!data) return <> </>

	return (
		<aside className="fixed bottom-0 bg-slate-900 drop-shadow-md w-full h-14 border-t border-slate-700 py-3 px-2 block sm:hidden lg:hidden md:hidden xl:hidden">
			<nav className="h-full flex">
				<ul className="flex items-center justify-between w-full px-3">{children}</ul>
			</nav>
		</aside>
	)
}

export default BottomBar
