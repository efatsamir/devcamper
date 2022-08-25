// import { registerSchema } from "../schemaValidation/schemaValidation.js"
import { AppError } from "../utils/AppError.js"
import asyncHandler  from 'express-async-handler';

const getErrorsObj = (err) => {
  const errors = err.details.reduce( (acc, x) => {
    acc[x.context.label] = {
     'msg': x.message,
     'value': err._original[x.context.label]
   }
   return acc

  }, {});

  return errors
}



export const validate =  schema => async (req, res, next) => {

  try{
   
    await schema.validateAsync(req.body, { abortEarly: false,  allowUnknown: true });
    next();

  }catch(err) {
   
    const errorsObj = getErrorsObj(err);
    // const error = new AppError(err.message, 400, errorsObj);
    const error = new AppError('validation error', 400, errorsObj);
    next(error);
  }   

}





