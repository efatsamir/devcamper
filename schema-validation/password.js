import Joi from "joi";

const pattern = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\#\$\.\%\&\*\@])(?=.*[a-zA-Z]).{8,16}$/;


export const passwordSchema = Joi.object({

       
    password: Joi.string().required().trim(true)
    .pattern(pattern)
    .messages({
      'string.pattern.base':'password must be at least 8 characters, at least one Uppercase, one digit and one special Character'
    }),
    

    confirmPassword: Joi.any().valid(Joi.ref('password'))
    .required()
    .options({ messages: { 'any.only': 'Password & Password Confirm does not match'} }),


})

 




