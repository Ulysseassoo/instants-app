"use client"

import React from "react"
import { MdClose } from "react-icons/md"

interface Props {
	children?: React.ReactNode
	getBack: () => void
	modalClass?: string
	isAnotherButton?: boolean
}

const Modal = ({ children, getBack, modalClass, isAnotherButton }: Props) => {
	return (
		<div className={`font-bold text-xl absolute top-0 left-0 flex items-center h-full bg-slate-900/40 backdrop-blur-sm justify-center w-full z-30`}>
			<div
				className={`max-w-xl w-full h-80 relative flex flex-col bg-slate-900 rounded-md shadow-md border-2 border-slate-700/20 justify-between ${
					modalClass ? modalClass : ""
				} `}>
				{!isAnotherButton && (
					<button type="button" onClick={getBack} className="h-10 absolute top-3 right-4 cursor-pointer ">
						<MdClose />
					</button>
				)}
				{children}
			</div>
		</div>
	)
}

export default Modal
