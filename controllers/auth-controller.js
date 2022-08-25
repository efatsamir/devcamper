import crypto from 'crypto';
import asyncHandler  from 'express-async-handler';
import User from '../models/User.js';
import { AppError } from './../utils/AppError.js';
// import sendEmail from '../utils/Emails/Email.js';
import { generate_cookie } from './../utils/generate_cookie.js';
import reqHandler from './reqHandler.js';
import { upload_one_photo } from './../utils/file_Upload.js';
import { email_reset_password, email_verify_email } from '../utils/Emails/Email.js';




// @desc       Register a user 
// @route      POST /api/v1/auth/signup
// @access     Public
export const register = asyncHandler ( async (req, res, next) => {
  
  const { first_name, last_name, email, role, password, confirmPassword } = req.body;


  const email_exists = await User.findOne({ email });
  if (email_exists) {
    return next(new AppError('email already exists', 400));
  }
  
  const newUser = await User.create({
    first_name,
    last_name,
    email,
    role,
    password,
    confirmPassword
  })

  if(newUser) {
    
    // sendEmail(newUser.email, 'Email verification');
   
    res
     .status(200)
     .json({
      success: true,
      status: 'pending',
      message: 'please confirm your email to login'
    })

  }
})


// @desc       Log-in a user 
// @route      POST /api/v1/auth/login
// @access     Public
export const login = asyncHandler ( async (req, res, next) => {

  const { email, password } = req.body;
  const user = await User.findOne({ email });
 
  if( !user ||
      !await user.verify_password(password) 
    ){
      return next(new AppError('Invalid email or password', 401));
  }

  if( user.status === 'not-verified'){
    // or you can send an error telling user to login
    return res
      .status(200)
      .json({
        success: true,
        status: 'pending',
        message: 'please verify your email to login'
    })

  }
  
  const jwt = await user.generate_JWT();
  const cookie = generate_cookie(jwt);

  res
   .status(200)
   .cookie(...cookie)
   .json({
    success: true,
    status: 'verified',
    message: 'successful login',
    data: {
      jwt
    }
    
  })
 
})



// @desc       Log user out 
// @route      GET /api/v1/auth/logout
// @access     Public
export const logout = (req, res) => {

  const cookie = [ 'jwt', 'logging out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  }];


  res
   .status(200)
   .cookie(...cookie)
   .json({ success: true });
}


// -----------------------------  Other functionality related to auth user   -------------------------------------- //

// @desc      forgot password 
// @route      POST /api/v1/auth/forgot-password
// @access     Public
export const forgot_password = asyncHandler ( async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select(' email ');

  if(!user) {
    return next(
      new AppError('There is no user with this email address', 404)
    )
  }

  // send email with reset token 
  const resetToken = await user.create_password_reset_token();
  await user.save({ validateBeforeSave: false });

  const baseURL = `${req.protocol}://${req.get('host')}`;
  try{

    await email_reset_password(user, baseURL, resetToken);

    res.status(200).json({
      success: true,
      message: "reset password token has been sent"
    });

  }catch(err) {
  //  console.log(err);
    user.password_reset_token = undefined;
    user.password_reset_expire = undefined;
    await user.save({ validateBeforeSave: false });

    return next( new AppError('Reset password email could not be sent. Try again later', 500));
  }

})


// @desc       reset password
// @route      PATCH /api/v1/auth/reset-password
// @access     Public
export const reset_password = asyncHandler ( async (req, res, next) => {
  
  const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

  const user = await User.findOne({ 
    password_reset_token: hashedToken ,
    password_reset_expire: { $gt: Date.now() } 
  });

// 2) If token has not expired, and there is user, set the new password
  if (!user) {
      return next(
         new AppError('token is invalid or has expired', 400)
      )
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.password_reset_token = undefined;
  user.password_reset_expire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'password changed successfully, you can now login'

  })


})


// @desc       update password
// @route      PATCH /api/v1/auth/update-password
// @access     Private
export const updatePassword = asyncHandler( async (req, res, next) => {

  const user = await User.findById( req.user.id ).select('password');
   if( !(await user.verify_password(req.body.currentPassword)) ) {
    return next( new AppError('password is incorrect!', 401));
   }

   user.password = req.body.password;
   user.confirmPassword = req.body.confirmPassword;
   await user.save();

   const jwt = await user.generate_JWT();
   const cookie = generate_cookie(jwt);
 
   res
    .status(200)
    .cookie(...cookie)
    .json({
     success: true,
     jwt
   })
})



export const send_verify_email = asyncHandler( async(req, res, next) => {

  const user = await User.findOne({ email: req.body.email }).select(' email ');

  if(!user) {
    return next(
      new AppError('There is no user with this email address', 404)
    )
  }

  const jwt = await user.generate_JWT();
  const baseURL = `${req.protocol}://${req.get('host')}`;

  try{

    await email_verify_email(user, baseURL, jwt);

    res.status(200).json({
      success: true,
      message: "Email with the verification link has been sent"
    });

  }catch(err) {
    console.log(err);
    return next( 
      new AppError('Verification Email could not be sent. Try again later', 500)
    );
  }

})



export const verify_email = asyncHandler( async(req, res, next) => {
  
 const email_jwt = req.params.jwt;
 if( !email_jwt ) {
    return next(
      new AppError('Invalid email verification link', 400)
    )
 }


  const user = await User.verify_JWT(req.params.jwt);
 
  user.email_verifiedAt = Date.now();
  user.status = 'verified';
  await user.save({ validateBeforeSave: false });

  const jwt = await user.generate_JWT();
  const cookie = generate_cookie(jwt);

  res
   .status(200)
   .cookie(...cookie)
   .json({
    success: true,
    status: 'verified',
    message: 'Email verified successfully, You can now login',
    data: {
      jwt
    }
   
  })

})



















// -------------------------------------------------------------------------------------------------

// @desc       Get Logged in User Profile
// @route      GET /api/v1/auth/profile
// @access     Private
export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
}



const filter_req_body = (req_body, ...allowedFields) => {

  const newObj = {};

  Object.keys(req_body).forEach( field => {
      if(allowedFields.includes(field)) 
        newObj[field] = req_body[field];
  })

  return newObj;
}

// @desc       Update User Profile
// @route      GET /api/v1/auth/update-profile
// @access     Private
export const updateMe = asyncHandler( async (req, res, next) => {

  const toBeUpdated_fields = filter_req_body(req.body, 'first_name', 'last_name', 'avatar');
  // if(req.file) toBeUpdated_fields.avatar= req.file.filename;

  // if( !(Object.keys(toBeUpdated_fields).length) ) {
  //   return next(
  //     new AppError('No data sent to be updated!', 400)
  //   )
  // }
 
  const updatedDoc = await User.findByIdAndUpdate(req.user.id, toBeUpdated_fields, {
    new: true,
    runValidators: true
});
  


  res
  .status(200)
  .json({
   success: true,
   data: updatedDoc
 })

})


// @desc       Delete Logged in User Profile
// @route      DELETE /api/v1/auth/delete-profile
// @access     Private
export const deleteMe = asyncHandler( async (req, res, next) => {
  
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res
      .status(204)
      .json({
        status: true,
        data: null
    })


})



// @desc       Update avatar
// @route      PATCH /api/v1/auth/profile-image
// @access     Private
export const updateAvatar = upload_one_photo('avatar');


