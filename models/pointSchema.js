import mongoose from 'mongoose';
const { Schema } = mongoose;

// GeoJSON Point
// define common pointschema using subdocuments & use it anywhere
// to store GeoJSON point
const pointSchema = new Schema({
   
   type: {
     type: String,
     enum: ['Point'],
     required: true
   },
   
   coordinates: {
     type: [Number],
     required: true,
     index: '2dsphere'
  }


})

export default pointSchema;