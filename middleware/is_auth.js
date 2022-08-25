import User from '../models/User.js';
import { AppError } from './../utils/AppError.js';
import asyncHandler  from 'express-async-handler';

const is_auth = asyncHandler(async (req, res, next) => {
  let jwt;

  if( req.headers.authorization 
    && req.headers.authorization.startsWith('Bearer')
  ){
     jwt = req.headers.authorization.split(' ')[1];

  }else if(req.cookies) {
    jwt = req.cookies.jwt;
  }

  if(!jwt) {
    return next(new AppError('Login is required', 401))
  }

  const user = await User.verify_JWT(jwt);
  if(!user) {
    return next(new AppError('User no longer exists', 401));
  }

  req.user = user;
  next();
})

export default is_auth;