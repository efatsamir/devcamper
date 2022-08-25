import Joi from "joi";



const pattern = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\#\$\.\%\&\*\@])(?=.*[a-zA-Z]).{8,16}$/;

export const registerSchema = Joi.object({

    first_name: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required()
                    .trim(true) 
                    .messages({
                      'string.alphanum': `first name should only include letters and numbers`,
                      'string.empty': `first name is required`,
                      'string.min': `"first name" should be at least 3 characters`,
                      'any.required': `first name is required`
                    }),
                    
    last_name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .trim(true),

    role: Joi.string().trim(true),
       
    password: Joi.string().required().trim(true)
    .pattern(pattern)
    .messages({
      'string.pattern.base':'password must be at least 8 characters, at least one Uppercase, one digit and one special Character'
    }),
    

    // confirmPassword: Joi.any().equal(Joi.ref('password'))
    // .required()
    // .messages({
    //   'any.only': 'Password & Password Confirm does not match' 
    // })


    // confirmPassword: Joi.any().valid(Joi.ref('password'))
    // .required()
    // .messages({
    //   'any.only': 'Password & Password Confirm does not match' 
    // })

    confirmPassword: Joi.any().valid(Joi.ref('password'))
    .required()
    .options({ messages: { 'any.only': 'Password & Password Confirm does not match'} }),

    email: Joi.string().required().trim(true).lowercase()
              .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
// .with('password', 'confirmPassword')
 




