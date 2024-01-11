"use client"

import useAuthStore from "@/store/authStore"
import { createClient } from "@/utils/supabase/client"
import React, { useEffect } from "react"

const Authentification = () => {
	const setLoggedIn = useAuthStore((state) => state.setLoggedIn)
	const supabase = createClient()
	const checkSession = async () => {
		const sessionSupabase = await supabase.auth.getSession()

		if (sessionSupabase.data.session !== null) {
			setLoggedIn(sessionSupabase.data.session)
		}
	}

	useEffect(() => {
		checkSession()
	}, [])

	return <></>
}

export default Authentification
