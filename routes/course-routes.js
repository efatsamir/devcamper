import express from 'express';
import { 
  getAllCourses, addCourse, getCourse,
   updateCourse, deleteCourse
} from '../controllers/course-controller.js';
import is_auth from '../middleware/is_auth.js';
import { restrictTo } from '../middleware/restrictTo.js';
import Course from '../models/Course.js';
import valid_exist_objectId from '../middleware/valid_exist_objectId.js';
import { is_managed_by_owner } from './../middleware/is_managed_by_owner.js';
import BootCamp from './../models/BootCamp.js';


const router = express.Router({ mergeParams: true });

// middleware to check if id is valid objectId & exist in DB
router.use('/:id/:resource?', valid_exist_objectId(Course));

router.route('/')
        .get( getAllCourses )
        .post(
          is_auth,
           restrictTo('publisher', 'admin'),
           is_managed_by_owner(BootCamp),
            addCourse 
        )



router.route('/:id')
      .get( getCourse )
      .patch(
            is_auth,
            restrictTo('publisher', 'admin'),
            is_managed_by_owner(Course),
            updateCourse 
      )
      .delete(
        is_auth,
        restrictTo('publisher', 'admin'),
        is_managed_by_owner(Course),
        deleteCourse 
      )




export default router;




