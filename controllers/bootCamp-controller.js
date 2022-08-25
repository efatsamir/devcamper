import  validator  from 'validator';
import  asyncHandler  from 'express-async-handler';
import BootCamp from './../models/BootCamp.js';
import reqHandler from './reqHandler.js';
// import geocoder from './../utils/geocoder.js';
import { upload_one_photo } from './../utils/file_Upload.js';
import { AppError } from './../utils/AppError.js';



// @desc         Get all BootCamps
// @route        1) GET /api/v1/BootCamps
//               2) GET /api/v1/BootCamps/:bootCampId/courses
// @access      Public
export const getAllBootCamps = reqHandler.getAll(BootCamp);


// @desc        Get BootCamp details
// @route       GET /api/v1/BootCamps/:id
// @access      Public
export const getBootCamp = reqHandler.getOne(BootCamp, 'reviews'); // we should add courses too



// @desc        Create new BootCamp
// @route       POST /api/v1/BootCamps
// @access      Private
export const addBootCamp = reqHandler.createOne(BootCamp, 'name');


// @desc        Update BootCamp
// @route       PUT /api/v1/BootCamps/:id
// @access      Private
export const updateBootCamp = reqHandler.updateOne(BootCamp);


// @desc        Delete BootCamp
// @route       DELETE /api/v1/BootCamps/:id
// @access      Private
export const deleteBootCamp = reqHandler.deleteOne(BootCamp);


// @desc        Get BootCamps within a distance
// @route       GET /api/v1/BootCamps/radius/:zipcode/:distance/unit/:unit
// @access      Private
export const getBootCamps_within_radius = asyncHandler( async (req, res, next) => {
  
  const { zipcode, distance, unit } = req.body;

  if(!validator.isPostalCode(zipcode)) {
    return next(new AppError('please enter valid zip code', 400));
  }
  
  
  // get lat & lng from geocoder
  const [{ latitude, longitude }] = await geocoder.geocode(zipcode);
  
  // mongodb expects the radius but in special unit called radiants
    // we should take the distance unit into consideration 

  // calc radius in radians unit, Divide distance by radius of earth
  // Earth Radius = 3963 mi / 6378 km
  const radius = unit === 'mi'? distance / 3963.2 : distance / 6378.1;

  const bootCamps = await BootCamp.find({
     location: { $geoWithin: {$centerSphere: [[longitude, latitude], radius]} }
   });

   res
   .status(200)
   .json({
     success: true,
     results: bootCamps.length,
     data: bootCamps
   })



})


// @desc        Upload photo for a BootCamp
// @route       PUT /api/v1/BootCamps/:id
// @access      Private
export const uploadPhoto_bootCamp = upload_one_photo('photo');





