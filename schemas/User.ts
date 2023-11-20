import * as yup from "yup"

export const loginSchema = yup.object({
	email: yup.string().required("An email is required."),
	password: yup.string().required("A password is required"),
	isRegister: yup.boolean().required(),
	username: yup.string().when("isRegister", {
		is: true,
		then: () => yup.string().required("A username is required."),
		otherwise: () => yup.string()
	})
})

export const userInformationsSchema = yup.object({
	full_name: yup
		.string()
		.min(3, "Your full name should be at least 3 characters.")
		.max(40, "Your full name should be maximum 40 characters long.")
		.required("A full name is required."),
	username: yup
		.string()
		.min(4, "Your username should be at least 4 characters.")
		.max(50, "Your username should be maximum 50 characters long.")
		.required("A username is required."),
	biography: yup
		.string()
		.min(6, "Your biography should be at least 6 characters.")
		.max(300, "Your biography shuld be maximum 300 characters long.")
		.required("A biography is required"),
	avatar_url: yup.string().required("A profile picture is required.")
})
