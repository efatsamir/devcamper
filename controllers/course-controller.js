import asyncHandler from 'express-async-handler';
import Course from './../models/Course.js';
import reqHandler from './reqHandler.js';



// @desc         - Get all courses
//               - Get all courses for a bootCamp
// @route        1) GET /api/v1/courses
//               2) GET /api/v1/BootCamps/:bootCampId/courses
// @access      Public
export const getAllCourses = reqHandler.getAll(Course, {
  path: 'bootCamp',
  select: 'name description'
});




// @desc        Get course details
// @route       GET /api/v1/courses/:id
// @access      Public
export const getCourse = reqHandler.getOne(Course, { 
    path: 'bootCamp',
    select: 'name description'
} );



// @desc            Create new course
// @route           POST /api/v1/bootCamps/:bootCampId/courses
// @access          Private
export const addCourse = asyncHandler( async (req, res, next) => {
  
   if(!req.body.bootCamp) req.body.bootCamp = req.params.bootCampId;
   if(!req.body.user) req.body.user = req.user.id;
    
    const course  = await Course.create(req.body);
    
    res
      .status(201)
      .json({
        success: true,
        data: course
      })
     

})


// @desc        Update course
// @route       PUT /api/v1/courses/:id
// @access      Private
export const updateCourse = reqHandler.updateOne(Course);


// @desc        Delete course
// @route       DELETE /api/v1/courses/:id
// @access      Private
export const deleteCourse = reqHandler.deleteOne(Course);





