import Joi from "joi";

const signInSchema = Joi.object({
        Email: Joi.string()
                .email()
                .required(),

        Password: Joi.string()
                .required()
});

export default signInSchema;