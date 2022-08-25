import Review from "../models/Review.js";
import reqHandler from "./reqHandler.js";



// @desc         - Get all reviews
//               - Get all reviews for a bootCamp
// @route        1) GET /api/v1/reviews
//               2) GET /api/v1/BootCamps/:bootCampId/reviews
// @access      Public
export const getAllReviews = reqHandler.getAll(Review, {
  path: 'bootCamp',
  select: 'name description'
});


// @desc        Get review details
// @route       GET /api/v1/reviews/:id
// @access      Public
export const getReview = reqHandler.getOne(Review);



// @desc        Add review 
// @route       POST /api/v1/BootCamps/:bootCampId/reviews
// @access      Private
export const addReview= reqHandler.createOne(Review);


// @desc        Update review 
// @route       PATCH /api/v1/reviews/:id
// @access      Private
export const updateReview= reqHandler.updateOne(Review);



// @desc        Delete review 
// @route       DELETE/api/v1/reviews/:id
// @access      Private
export const deleteReview= reqHandler.deleteOne(Review);
