import signInSchema from "../schemas/SignInSchema.js";

export function signInValidation(req, res, next){
    const { email, password } = req.body;

    if(signInSchema.validate({Email: email, Password: password}).error !== undefined){
        if(signInSchema.validate({Email: email, Password: password}).error.message === '"Email" is required'){
            return res.status(422).send("O campo email é obrigatório");
        }
        if(signInSchema.validate({Email: email, Password: password}).error.message === '"Email" must be a valid email'){
            return res.status(422).send("O campo email deve conter um email válido");
        }
        if(signInSchema.validate({Email: email, Password: password}).error.message === '"Password" is required'){
            return res.status(422).send("O campo senha é obrigatório");
        }

        return res.status(422).send(signInSchema.validate({Email: email, Password: password}).error.message);
    }

    next();

}