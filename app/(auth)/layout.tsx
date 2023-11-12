import { GeistSans } from "geist/font"
import "../globals.css"

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Instants",
	description: "Authentication on Instants"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={GeistSans.className}>
			<body suppressHydrationWarning={true}>{children}</body>
		</html>
	)
}
