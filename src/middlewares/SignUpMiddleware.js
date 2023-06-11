import signUpSchema from '../schemas/SignUpSchema.js';

export function signUpValidation (req, res, next){
    const { name, image, email, password} = req.body;

    if(signUpSchema.validate({Name: name, Image:image,  Email: email, Password: password}).error !== undefined){

        if(signUpSchema.validate({Name: name, Image:image, Email: email, Password: password}).error.message === '"Name" is not allowed to be empty'){
            return res.status(422).send("O campo name é obrigatório.")
        }
        if(signUpSchema.validate({Name: name, Image:image, Email: email, Password: password}).error.message === '"Name" length must be at least 3 characters long'){
            return res.status(422).send("O campo name deve conter ao menos 3 caractéres.")
        }
        if(signUpSchema.validate({Name: name, Image:image, Email: email, Password: password}).error.message === '"Image" is required'){
            return res.status(422).send("O campo image é obrigatório.")
        }
        if(signUpSchema.validate({Name: name, Image:image,  Email: email, Password: password}).error.message === '"Email" is not allowed to be empty'){
            return res.status(422).send("O campo email é obrigatório.")
        }
        if(signUpSchema.validate({Name: name, Image:image,  Email: email, Password: password}).error.message === '"Password" is not allowed to be empty'){
            return res.status(422).send("O campo senha é obrigatório.")
        }
        if(signUpSchema.validate({Name: name, Image:image,  Email: email, Password: password}).error.message === '"Password" length must be at least 8 characters long'){
            return res.status(422).send("O campo senha dever ter mais de 8 caractéres.")
        }

        return res.status(422).send(signUpSchema.validate(
            {Name: name, Image:image,  Email: email, Password: password}
            ).error.message)
    }

    //
    next();
}