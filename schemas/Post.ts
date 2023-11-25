import * as yup from "yup"

export const createPostSchema = yup.object({
	content: yup.string().required().min(0).max(280)
})
