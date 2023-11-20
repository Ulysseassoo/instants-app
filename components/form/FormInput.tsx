import React, { useState } from "react"
import { IconType } from "react-icons/lib"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

interface Props {
	label: string
	placeholder: string
	IconName?: IconType
	helperText?: string
	errorMessage?: string
	isRequired?: boolean
	isTextArea?: boolean
	isPassword?: boolean
	value: string | number | readonly string[] | undefined
	onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined
	onBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined
}

const FormInput = ({
	label,
	placeholder,
	IconName,
	helperText,
	errorMessage,
	isRequired,
	isTextArea,
	isPassword,
	value,
	onChange,
	onBlur
}: Props) => {
	const [isShow, setIsShow] = useState(false)
	const handleClick = () => setIsShow(!isShow)

	return (
		<div className={`form-control ${Boolean(errorMessage) ? "invalid" : ""}`}>
			<label className="block mb-2">{label}</label>
			<div className="relative">
				{isTextArea ? (
					<textarea
						className="border-primary no-resize h-40 focus:border-primary block w-full border rounded-md p-2 pl-3 focus:outline-none focus:ring-2 ring-primary text-current"
						placeholder={placeholder}
						value={value}
						onChange={onChange}
						onBlur={onBlur}
					/>
				) : (
					<input
						className="border-primary focus:border-primary block w-full border rounded-md p-2 pl-3 focus:outline-none focus:ring-2 ring-primary text-current"
						type={isShow ? "text" : isPassword ? "password" : "text"}
						placeholder={placeholder}
						value={value}
						onChange={onChange}
						onBlur={onBlur}
					/>
				)}
				{IconName ? (
					<div className="absolute inset-y-0 right-0 pr-2 flex items-center">
						<IconName className="h-5 w-5 text-gray-500" />
					</div>
				) : null}
				{isPassword ? (
					<div className="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer" onClick={handleClick}>
						{isShow ? <AiOutlineEyeInvisible className="h-5 w-5 text-gray-500" /> : <AiOutlineEye className="h-5 w-5 text-gray-500" />}
					</div>
				) : null}
			</div>
			{helperText && <p className="text-slate-500 my-1.5">{helperText}</p>}
			{errorMessage && <p className="text-red-600 mt-1">{errorMessage}</p>}
		</div>
	)
}

export default FormInput
