import User from './../models/User.js';
import reqHandler from './reqHandler.js';
import  asyncHandler  from 'express-async-handler';




// @desc        Get all users 
// @route       GET /api/v1/users
// @access      Private / Admin
export const getAllUsers = reqHandler.getAll(User);


// @desc        Get user details
// @route       GET /api/v1/users/:id
// @access      Private / Admin
export const getUser = reqHandler.getOne(User);


// @desc        Get user details
// @route       GET /api/v1/users/:id
// @access      Private / Admin
export const updateUser = reqHandler.updateOne(User);



// @desc        Get user details
// @route       GET /api/v1/users/:id
// @access      Private / Admin
export const deleteUser = reqHandler.deleteOne(User);


export const addUser = asyncHandler( async (req, res, next) => {
  
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user
  })
})




