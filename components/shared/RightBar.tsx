import React from "react"

const RightBar = () => {
	return (
		<section className="custom-scrollbar bg-slate-900 right-sidebar">
			<div className="flex flex-1 flex-col justify-start">
				<h3 className="font-bold">Suggested Communities</h3>
			</div>
			<div className="flex flex-1 flex-col justify-start">
				<h3 className="font-bold">Suggested Users</h3>
			</div>
		</section>
	)
}

export default RightBar
