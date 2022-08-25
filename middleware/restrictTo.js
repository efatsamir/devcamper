import  asyncHandler  from 'express-async-handler';
import  { AppError } from '../utils/AppError.js';


export const restrictTo = ( ...roles ) => asyncHandler( async (req, res, next) => {
  
  // roles = ['publisher', 'admin']
  if(!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }

  next();
})

