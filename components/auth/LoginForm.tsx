"use client"
import { createClient } from "@/utils/supabase/client"
import { yupResolver } from "@hookform/resolvers/yup"
import { HiOutlineMail, HiOutlineUser } from "react-icons/hi"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { loginSchema } from "@/schemas/User"
import { toast } from "react-toastify"
import FormInput from "../form/FormInput"
import { BsGithub } from "react-icons/bs"

type LoginFormData = {
	email: string
	password: string
	username: string | undefined
	isRegister: boolean
}

const LoginForm = () => {
	const supabase = createClient()
	const [formState, setFormState] = useState("login")
	const router = useRouter()
	const {
		control,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isSubmitting, isLoading }
	} = useForm<LoginFormData>({
		defaultValues: {
			email: "",
			password: "",
			username: "",
			isRegister: false
		},
		mode: "onChange",
		resolver: yupResolver(loginSchema)
	})

	useEffect(() => {
		if (formState === "login") {
			setValue("isRegister", false)
		} else {
			setValue("isRegister", true)
		}
	}, [formState, setValue])

	const register = async (data: LoginFormData) => {
		try {
			const {
				data: { user },
				error
			} = await supabase.auth.signUp({
				email: data.email,
				password: data.password,
				options: {
					emailRedirectTo: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/callback`,
					data: {
						has_profile: false
					}
				}
			})

			if (error) {
				throw Error(error.message)
			}

			if (data.username && user !== null) {
				const updates = {
					username: data.username,
					user_id: user?.id
				}
				const { error: errorProfile } = await supabase.from("profiles").insert(updates)
				if (errorProfile) throw errorProfile
				reset()
				toast.success("An email has been sent to you. Confirm your email, and connect yourself.")
			}
		} catch (error) {
			throw error
		}
	}

	const onSubmit = async (data: LoginFormData) => {
		try {
			if (formState === "login") {
				const response = await supabase.auth.signInWithPassword({
					email: data.email,
					password: data.password
				})

				if (response.error !== null) {
					throw Error(response.error.message)
				}

				router.push("/")
			} else {
				register(data)
			}
		} catch (error: any) {
			toast.error(error.message || "Veuillez réessayer plus tard.")
		}
	}

	return (
		<form className="flex flex-col gap-4 text-white " style={{ width: "90%" }} onSubmit={handleSubmit(onSubmit)}>
			{formState === "register" && (
				<Controller
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<FormInput
							label="Username"
							placeholder="Your username"
							IconName={HiOutlineMail}
							errorMessage={errors.username?.message}
							value={value}
							onChange={onChange}
							onBlur={onBlur}
						/>
					)}
					name="username"
				/>
			)}
			<Controller
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<FormInput
						label="Email"
						placeholder="hello@welcome.com"
						IconName={HiOutlineUser}
						errorMessage={errors.email?.message}
						value={value}
						onChange={onChange}
						onBlur={onBlur}
					/>
				)}
				name="email"
			/>
			<Controller
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<FormInput
						label="Password"
						placeholder="****"
						isPassword
						errorMessage={errors.password?.message}
						value={value}
						onChange={onChange}
						onBlur={onBlur}
					/>
				)}
				name="password"
			/>
			<button
				className="mt-4 p-2 w-full flex items-center justify-center text-white rounded-md overflow-hidden bg-gradient-to-r from-primary via-secondary to-tertiary"
				type="submit"
				disabled={isSubmitting || isLoading}>
				{isSubmitting || isLoading ? (
					<div className="grid grid-rows-1 grid-cols-1 place-items-center">
						<svg width="25px" height="25px" className="animate-spin grid-center" viewBox="0 0 24 24">
							<g>
								<path fill="none" d="M0 0h24v24H0z" />
								<path fill="#fff" d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z" />
							</g>
						</svg>
					</div>
				) : (
					<span className="block text-white">{formState === "login" ? "Sign In" : "Sign Up"}</span>
				)}
			</button>
			<p className="text-gray-400 text-center">
				{formState === "login" ? (
					<span className="underline cursor-pointer" onClick={() => setFormState("register")}>
						Don&apos;t have an account? Sign Up
					</span>
				) : (
					<span className="underline cursor-pointer" onClick={() => setFormState("login")}>
						Already have an account? Sign In
					</span>
				)}
			</p>
		</form>
	)
}

export default LoginForm
