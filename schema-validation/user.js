import Joi from "joi";


export const userUpdateSchema = Joi.object({

    first_name: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .trim(true) 
                    .messages({
                      'string.alphanum': `first name should only include letters and numbers`,
                      'string.empty': `first name can not be empty`,
                      'string.min': `"first name" should be at least 3 characters`,
                      
                    }),
                    
    last_name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .trim(true)
        .messages({
          'string.alphanum': `last name should only include letters and numbers`,
          'string.empty': `last name can not be empty`,
          'string.min': `"last name" should be at least 3 characters`,
          
        })
})
.or('first_name', 'last_name')
.messages({
  'object.missing': 'You must add first_name or last_name to continue'
})

 




