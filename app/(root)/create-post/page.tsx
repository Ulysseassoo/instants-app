import { redirect } from "next/navigation"
import React from "react"

const page = () => {
	// To not have error when refreshing the page on this url
	redirect("/")
}

export default page
