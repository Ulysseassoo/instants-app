import { GeistSans } from "geist/font"
import "../globals.css"
import { ToastContainer } from "react-toastify"
import Sidebar from "@/components/shared/Sidebar"
import SidebarItem from "@/components/shared/SidebarItem"
import ButtonSidebar from "@/components/shared/ButtonSidebar"
import TopBar from "@/components/shared/TopBar"
import RightBar from "@/components/shared/RightBar"
import BottomBar from "@/components/shared/BottomBar"

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Instants",
	description: "Instants - The social media where you can share about your life instantly."
}

export default function RootLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
	return (
		<html lang="en">
			<body suppressHydrationWarning={true} className={GeistSans.className}>
				<ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop={false} closeOnClick />
				<main className="flex flex-row ">
					<Sidebar>
						<SidebarItem text="Home" href="/" />
						<SidebarItem text="Search" href="/search" />
						<SidebarItem text="Notifications" href="/notifications" isAlert />
						<SidebarItem text="Communities" href="/communities" />
						<SidebarItem text="Profile" href="/profile" />
						<SidebarItem text="Messages" href="/messages" />
						<ButtonSidebar text="Create Post" />
					</Sidebar>

					<section className="main-container">
						<TopBar />
						<div className="w-full max-w-4xl px-4 sm:px-10 ">
							{children}
							{modal}
						</div>
					</section>

					<RightBar />

					<BottomBar>
						<SidebarItem text="Home" href="/" isMobile />
						<SidebarItem text="Search" href="/search" isMobile />
						<SidebarItem text="Notifications" href="/notifications" isAlert isMobile />
						<SidebarItem text="Create Post" href="/create-post" isMobile />
						<SidebarItem text="Communities" href="/create/community" isMobile />
						<SidebarItem text="Profile" href="/profile" isMobile />
					</BottomBar>
				</main>
			</body>
		</html>
	)
}
