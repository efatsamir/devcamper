import Joi from "joi";

export const loginSchema = Joi.object({


  email: Joi.string()
  .required()
  .trim(true)
  .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
  .messages({
    'string.email': `Enter valid email format: example@example.com`,
}),


password: Joi.string()
              .required()
              .trim(true)
                   
})