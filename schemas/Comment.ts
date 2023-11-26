import * as yup from "yup"

export const createCommentSchema = yup.object({
	content: yup.string().required().min(3).max(280)
})
