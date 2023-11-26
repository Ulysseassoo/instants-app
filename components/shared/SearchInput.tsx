"use client"

import React from "react"
import { BsSearch } from "react-icons/bs"

interface Props {
	handleOnChange: (value: string) => void
	value: string
	infoText: string
}

const SearchInput = ({ handleOnChange, value, infoText }: Props) => {
	return (
		<div className="relative">
			<div className="absolute top-3 left-2 text-white">
				<BsSearch />
			</div>
			<input
				className="bg-slate-600 shadow-sm mt-4 text-white w-full border-slate-900 focus:border-primary block border rounded-md p-2 pl-8 focus:outline-none"
				type="text"
				onChange={(e) => handleOnChange(e.target.value)}
				value={value}
			/>
			{infoText ? <p className="text-slate-400 my-1.5">{infoText}</p> : null}
		</div>
	)
}

export default SearchInput
