import _ from "lodash";
import mongoose from "mongoose";
import  asyncHandler  from 'express-async-handler';
const { Schema } = mongoose;

// review will belong to bootcamp

const schema = new Schema({
  
  rating:{
   type: Number,
   required: [true, 'please add a rating number'],
   min: [1, 'rating should be between 1 & 5'],
   max: [5, 'rating should be between 1 & 5']
  },

  comment: {
    type: String,
    trim: true
  },
    
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'review should belong to a user']
  },

  bootCamp: {
    type: Schema.ObjectId,
    ref: 'BootCamp',
    required: [true, 'review should belong to a bootcamp']
  }


}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => _.omit(ret, ['__v'])
  },

  toObject: {virtuals: true} 
});


schema.statics.calcAvgRatings = async function (bootCampId) {
  const stats = await this.aggregate([
    { $match: { bootCamp: bootCampId } },
    { 
      $group: { 
        _id: '$bootCamp',
        num_reviews: { $sum: 1 },
        avgRating: { $avg: '$rating' } 
      }
    }
    
  ]);

 
   if(stats.length) {
    asyncHandler(
      await this.model('BootCamp')
                .findByIdAndUpdate(bootCampId, {
                  num_reviews: stats[0].num_reviews,
                  averageRating : stats[0].avgRating
                })
    
    )
  }

}


//  ---------------------- apply middleware -------------------------------------------  //


// user can add only 1 review on each bootCamp
schema.index({ user: 1, bootCamp: 1 }, { unique: true });

schema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'full_name avatar'
  })

  next();
})

// doc middleware
schema.post('save', function() {
  this.constructor.calcAvgRatings(this.bootCamp);
})


// query middleware
// make doc available to make more process before update or delete doc
// findByIdAndUpdate => is shorthand for findOneAndUpdate by the current id
// findByIdAndDelete
schema.pre(/^findOneAnd/, async function(next) {
  // add doc to the middleware to catch it in the post middleware
  // note: use .clone() as Mongoose no longer allows executing the same query object twice
  // so this won't work this.doc = await this.findOne()
  this.doc = await this.findOne().clone();
  next();
})

// query middleware
// run after updating and deleting
schema.post(/^findOneAnd/, async function() {
  await this.doc.constructor.calcAvgRatings(this.doc.bootCamp);
})









const Review = new mongoose.model('Review', schema);
export default Review;