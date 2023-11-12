/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			fontSize: {
				"2xs": "0.5rem"
			},
			colors: {
				current: "#1D1D1D",
				primary: "rgba(107,151,247,0.8)",
				secondary: "rgba(117,37,226,0.8)",
				tertiary: "rgba(255,73,124,0.8)"
			}
		}
	},
	plugins: []
}
