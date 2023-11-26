"use client"

import React from "react"

interface Props {
	isValid: boolean
	isSubmitting: boolean
	text: string
	className?: string
}

const SubmitButton = ({ isValid, isSubmitting, text, className }: Props) => {
	return (
		<button
			className={`cursor-pointer text-sm p-0 w-fit flex items-center justify-center text-white rounded-md overflow-hidden bg-gradient-to-r from-primary via-secondary to-tertiary disabled:opacity-30 disabled:cursor-default ${
				className !== undefined ? className : ""
			}`}
			type="submit"
			disabled={!isValid || isSubmitting}>
			{isSubmitting ? (
				<div className="grid grid-rows-1 grid-cols-1 place-items-center">
					<svg width="25px" height="25px" className="animate-spin grid-center" viewBox="0 0 24 24">
						<g>
							<path fill="none" d="M0 0h24v24H0z" />
							<path fill="#fff" d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z" />
						</g>
					</svg>
				</div>
			) : (
				<span className="block p-2 text-white">{text}</span>
			)}
		</button>
	)
}

export default SubmitButton
