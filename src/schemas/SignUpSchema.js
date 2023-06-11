import Joi from "joi";

const signUpSchema = Joi.object({
        Name: Joi.string()
                .min(3)
                .required(),

        Image: Joi.string()
                .uri()
                .required(),

        Email: Joi.string()
                .email()
                .required(),

        Password: Joi.string()
                .min(8)
                .required()
})

export default signUpSchema;