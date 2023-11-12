import BackgroundAnimated from "@/components/BackgroundAnimated"
import Logo from "@/components/shared/Logo"
import Image from "next/image"
import React from "react"
import LoginImage from "../../images/login.jpg"
import LoginForm from "@/components/auth/LoginForm"

const Login = async () => {
	return (
		<div className="h-screen w-full relative overflow-hidden">
			<BackgroundAnimated>
				<div className="flex h-full bg-white rounded-3xl overflow-hidden shadow-md">
					<div className="w-1/2 h-full hidden lg:block overflow-hidden">
						<Image src={LoginImage} height={1200} width={1200} alt="Login Background" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw" />
					</div>

					<div className="w-full lg:w-1/2 py-4 px-4 flex flex-col items-center gap-8 justify-center bg-slate-900">
						<div className="flex flex-col items-center gap-2">
							<Logo />
							<h2 className="text-white opacity-80 text-sm md:text-base lg:text-xl">Come share your story life with the world</h2>
						</div>

						<LoginForm />
					</div>
				</div>
			</BackgroundAnimated>
		</div>
	)
}

export default Login
