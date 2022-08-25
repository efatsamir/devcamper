import _ from 'lodash';
import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';
import pointSchema from './pointSchema.js';
// import geocoder from './../utils/geocoder.js'

const { Schema } = mongoose;

const schema = new Schema ({

   name: {
     type: String,
     required: [true, 'BootCamp name is required'],
     unique: true,
     trim: true,
     minlength: [3, 'Name must be more than 3 characters'],
     maxlength: [100, 'Name can not be more than 100 characters']
   },
   slug: String,
   description: {
    type: String,
    required: [true, 'BootCamp description is required'],
    trim: true,
    minlength: [3, 'Description must be more than 3 characters'],
    maxlength: [500, 'Description can not be more than 500 characters']
   },

   website: {
     type: String,
     validate: [validator.isURL, 'please provide a valid URL with HTTP or HTTPS']
     
    //  match: [
    //   / add regex here /
    //   ,
    //   'Please enter a valid URL with HTTP or HTTPS'
    //  ]
     
   },

   email: {
     type: String,
     validate: [validator.isEmail, 'please provide a valid email']
    //  match: [
    //   / add regex here /
    //    ,
    //   'Please enter a valid Email'

    //  ]
   },

   
   phone: {
    type: String,
    maxlength: [20, 'Phone number can not be more than 20 characters']
  },

   address: {
     type: String,
     required: [true, 'Please add an address']
   }, 

  location: {
    type: pointSchema,
    // required: true,
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },

  careers: {
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other'
    ]
  },

  averageRating: {
    type: Number,
    default: null,
    min: [1, 'A rating must be above 1'],
    max: [5, 'A rating must be below 5'],
    set: val => Math.round(val * 10) / 10
  },

  num_reviews: {
    type: Number,
    default: 0
  },

  averageCost: Number,

  photo: {
    type: String,
    default: 'no-photo.jpg'
  },

  housing: {
   type: Boolean,
   default: false
  },

  jobAssistance: {
    type: Boolean,
    default: false,
    
  },

  jobGuarantee: {
    type: Boolean,
   default: false,
   
  },

  acceptGi: {
    type: Boolean,
   default: false
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'BootCamp should belong to a user']

  }


}, {

  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => _.omit(ret, ['__v'])
  },

   toObject: {virtuals: true} 

});


//  ---------------------- indexes -------------------------------------------  //

schema.index({ averageCost: 1, averageRating: -1 });
schema.index({ slug: 1 });
schema.index({ jobAssistance: 1 });
schema.index({ jobGuarantee: 1 });




//  ---------------------- apply middleware -------------------------------------------  //


// 1) create bootCamp slug from the bootCamp name
schema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
})

// 2) Geocode & create location field
// schema.pre('save', async function (next) {
//  const loc = await geocoder.geocode(this.address);
//  this.location = {
//    type: 'Point',
//    coordinates: [loc[0].longitude, loc[0].latitude],
//    formattedAddress: loc[0].formattedAddress,
//    street: loc[0].street,
//    city: loc[0].city,
//    state: loc[0].stateCode,
//    zipCode: loc[0].zipcode,
//    country: loc[0].countryCode
//  }

//  // Don't save the address that user entered in DB
// //  this.address = undefined;

//   next();
// })


// 3) Cascade delete all courses belong to a bootCamp 
// when a bootCamp is deleted
schema.pre('remove', async function (next) {

  await this.model('Course').deleteMany({ bootCamp: this._id });

  next();
}) // should be edited



//  ---------------------- use virtual property -------------------------------------------  //

// reverse populate with virtual ( populated virtual )
// this field will show in outputs and doesn't exist in DB
schema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootCamp',
  justOne: false
})


schema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bootCamp',
  justOne: false
})







const BootCamp =  mongoose.model('BootCamp', schema);
export default BootCamp;


