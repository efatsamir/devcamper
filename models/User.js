import crypto from 'crypto';
import util from 'util';
import mongoose from 'mongoose';
import lodash from 'lodash';
import validator from 'validator';
import  Jwt  from 'jsonwebtoken';
import hash_password from './../utils/hash_password.js';
import  bcrypt  from 'bcryptjs';
import config from './../config/config.js'
import is_valid_jwt from '../utils/is_valid_jwt.js';
import { AppError } from '../utils/AppError.js';
const { Schema } = mongoose;
const { JWT_SECRET } = config;


const schema = new Schema({

  first_name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'first name can not be less than 3 characters'],
    maxlength: [20, 'first name can not be more than 50 characters'],
  },

  last_name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'last name can not be less than 3 characters'],
    maxlength: [20, 'last name can not be more than 50 characters'],
  },


  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email']
   
  },

  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user'
  },

  avatar: {
      type: String,
      default: 'default.jpg'
  },

  password: {
     type: String,
     required: [true, 'password is required'],
     minlength: 8,
    //  select: false

  },

  confirmPassword: {
    type: String,
    required: [true, 'confirmPassword is required'],
    validate: {
      // this only works on save & not on update 
      validator: function (el) {
        return el === this.password;
      },

      message:'password and confirm password do not match!'
    }
  },

  status: {
    type: String,
    enum: ['not-verified', 'verified'],
    default: 'not-verified'
  },

  active: {
    type: Boolean,
    default: true,
    select: false
  },

  email_verifiedAt: {
    type: Date
  },
  
  password_changedAt: Date,
  password_reset_token: String,
  password_reset_expire: Date
 
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => lodash.omit(ret, 
      [ '__v', 'password',
      'active', 'email_verifiedAt',
      'password_changedAt', 'password_reset_token',
      'password_reset_expire',
      'createdAt', 'updatedAt'

    ])
   },

   toObject: {virtuals: true} 



  
})





// ---------------------------------  middleware --------------------------- //

// A) DOC Middleware | hash passwords when adding new user to DB
schema.pre('save', async function (next) {

  if( !this.isModified('password') ) return next();

  this.password = await hash_password(this.password);

  this.confirmPassword = undefined;
  next();
})

// B) QUERY Middleware | return only non-banned users
schema.pre(/^find/, function (next) {
  this.find({ active: true });

  next();
})

// add virtual field
schema.virtual('full_name').get(function(){
  return `${this.first_name} ${this.last_name}`;
})





// ---------------------------------  methods --------------------------- //

// 1) 
schema.methods.verify_password = async function (plain_password) {
  return await bcrypt.compare(plain_password, this.password);
}

// 2) 
const signJWT = util.promisify(Jwt.sign);
schema.methods.generate_JWT = function () {
   return signJWT(
     {id: this._id},
     JWT_SECRET,
     { expiresIn: '30d'}
   );
}

// 3) 
const verifyJWT = util.promisify(Jwt.verify);
schema.statics.verify_JWT = async function (token) {
  // is_valid_jwt(token);
  try{
    const { id } = await verifyJWT(token, JWT_SECRET);
    const user = await User.findById(id);
    return user;

  }catch(err) {
    return new AppError('JWT is invalid or expired!', 400)
    
  }

}

// 4) 
schema.methods.create_password_reset_token = function () {
  // crypto.randomBytes() gives buffer so convert to string
  const resetToken = crypto.randomBytes(32).toString('hex');

  // store hashed version,  expires after 15 mins
  this.password_reset_token = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // expires after 15 minutes
  this.password_reset_expire = Date.now() + ( 15 * 60 * 1000 );

  return resetToken;

}











// --------------------------------- export Model --------------------------- //

const User = mongoose.model('User', schema);
export default User;