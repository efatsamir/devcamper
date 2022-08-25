import mongoose from "mongoose";
import _ from 'lodash';
const { Schema } = mongoose;


const schema = new Schema({

   title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true 
   },
   
   description: {
      type: String,
      required: [true, 'Course description is required'],
      trim: true 
   },

   weeks: {
      type: String,
      required: [true, 'Please add course duration in weeks'],
      trim: true  
   },

   tuition: {
      type: Number,
      required: [true, 'Please add a tuition cost']
      
   },
   weeks: {
      type: String,
      required: [true, 'Please add course duration in weeks'],
      trim: true  
   },

   minimumSkill: {
      type: String,
      required: [true, 'Please add a minimum skill'],
      enum: ['beginner', 'intermediate', 'advanced'] 
   },

   scholarshipsAvailable: {
      type: Boolean,
      default: false
   },

   bootCamp: {
      type: Schema.ObjectId,
      ref: 'BootCamp',
      required: [true, 'course should belong to a bootcamp']
   },
   user: {
      type: Schema.ObjectId,
      ref: 'Course',
      required: [true, 'course should belong to a user']
   }


}, {

   timestamps: true,
   toJSON: {
      transform: (doc, ret) => _.omit(ret, ['__v'])
   }

});


// -----------------------------------------------------------

schema.index({ minimumSkill: 1 })
schema.index({ scholarshipsAvailable: 1 })
schema.index({ tuition: 1 })












// -------------------------------------------------------------------- //

// 4) static method to get avg of courses tuition in a bootCamp
schema.statics.getAverageCost = async function(bootCampId) {

   const [{ averageCost }] = await this.aggregate([
 
    {
       $match: { bootCamp: bootCampId }
    },
    {
       $group: {  
         _id: '$bootCamp',
         averageCost: { $avg: '$tuition' }
       }
    }
 
   ]);

   try {
     await this.model('BootCamp')
               .findByIdAndUpdate(bootCampId, {
                   averageCost: Math.ceil(averageCost / 10) * 10 
               });

   } catch(err) {
     console.log(err);
   }


 }
 
 // update averageCost after saving & before removing a document
 schema.post('save', function () {
   this.constructor.getAverageCost(this.bootCamp);
 })

 
 schema.pre('remove', function () {
   this.constructor.getAverageCost(this.bootCamp);
 })// should be edited as reviews
 




const Course =  mongoose.model('Course', schema);
export default Course;



























