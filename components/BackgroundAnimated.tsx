"use client"

import React from "react"
import { motion } from "framer-motion"

interface Props {
	children: React.ReactNode
}

const BackgroundAnimated = ({ children }: Props) => {
	return (
		<motion.div
			className="h-full p-4 lg:p-10 bg-gradient-to-b from-primary via-secondary to-tertiary bg-180"
			animate={{
				backgroundPosition: ["50% 0%", "50% 100%", "50% 0%"]
			}}
			transition={{
				duration: 8,
				ease: "linear",
				repeat: Infinity,
				repeatType: "reverse"
			}}>
			{children}
		</motion.div>
	)
}

export default BackgroundAnimated
