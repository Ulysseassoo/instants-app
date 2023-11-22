"use client"

import React from "react"
import { GiExtraTime } from "react-icons/gi"

const ClientLogo = () => {
	return (
		<div className="flex items-center space-x-2">
			<svg width="0" height="0">
				<linearGradient id="blue-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
					<stop stopColor="#6b97f7" offset="0%" />
					<stop stopColor="#7524e2" offset="50%" />
					<stop stopColor="#ff497c" offset="100%" />
				</linearGradient>
			</svg>
			<GiExtraTime style={{ fill: "url(#blue-gradient)", height: "35px", width: "35px", stroke: "#fff" }} />
			<h1 className="user-select-none italic text-3xl text-white font-bold">Instants</h1>
		</div>
	)
}

export default ClientLogo
