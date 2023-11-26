"use client"

import React, { useEffect, useState } from "react"
import UserCard from "./UserCard"
import SearchInput from "../shared/SearchInput"
import ProfileInterface from "@/interfaces/Profile"
import { createClient } from "@/utils/supabase/client"

const UsersSearch = () => {
	const supabase = createClient()
	const [isLoading, setIsLoading] = useState(false)
	const [users, setUsers] = useState<ProfileInterface[]>([])
	const [searchText, setSearchText] = useState("")

	const handleInputText = async (textValue: string) => {
		setSearchText(textValue)
	}

	const searchUser = async (text: string) => {
		if (text === "") return
		try {
			setIsLoading(true)
			const { data, error } = await supabase.from("profiles").select("*").or(`full_name.ilike.%${text}%,username.ilike.%${text}%`).range(0, 20)
			if (error) throw error.message
			// const otherProfiles = data.filter((p) => p.id !== actualProfile?.id);
			setUsers(data)
			setIsLoading(false)
		} catch (error) {
			console.log(error)
			setIsLoading(false)
		}
	}

	useEffect(() => {
		searchUser(searchText)
	}, [searchText])

	return (
		<>
			<SearchInput handleOnChange={handleInputText} value={searchText} infoText="Try to look up any users." />

			<div className="mt-4 flex flex-col gap-4">
				<hr className="bg-slate-700 border-none w-full h-1" />
				{users && users.length > 0 ? users.map((user) => <UserCard key={user.id} {...user} />) : <p>No users found.</p>}
			</div>
		</>
	)
}

export default UsersSearch
