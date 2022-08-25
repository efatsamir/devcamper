import asyncHandler  from 'express-async-handler';
import { AppError } from '../utils/AppError.js';

export const is_managed_by_owner = model => asyncHandler( async (req, res, next) => {
  
  let userId;

  const { user } = await model.findById(Object.values(req.params)[0]).select('user');
  userId = user;

  // due to populate user on review => user will be {} & not id
  if(model.modelName == 'Review') {
    userId = user.id;
  }

  // user can only manage his bootCamp or course
  if( req.user.id !== userId.toString() && req.user.role !== 'admin' ) {
    return next(
      new AppError('Not authorized to perform this action', 403)
    )
    
  }

  next();

  
})