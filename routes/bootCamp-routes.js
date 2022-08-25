import express from 'express';
import { getAllBootCamps, addBootCamp, getBootCamp, updateBootCamp,
       deleteBootCamp, getBootCamps_within_radius, uploadPhoto_bootCamp,  
} from '../controllers/bootCamp-controller.js';
import courseRouter from './course-routes.js';
import reviewRouter from './review-routes.js';
import { resizePhoto } from '../utils/file_Upload.js';
import valid_exist_objectId from '../middleware/valid_exist_objectId.js';
import BootCamp from '../models/BootCamp.js';
import is_auth from './../middleware/is_auth.js';
import { restrictTo } from './../middleware/restrictTo.js';
import { is_managed_by_owner } from '../middleware/is_managed_by_owner.js';
const router = express.Router();


// middleware to check if id is valid objectId & exist in DB
router.use('/:id/:resource?', valid_exist_objectId(BootCamp));


// Re-route into other resource routers
router.use('/:bootCampId/courses', courseRouter);
router.use('/:bootCampId/reviews', reviewRouter);


// here user will enter zipcode & we will use it to get lat & long by geocoder
router.get('/radius/:zipcode/:distance/unit/:unit', getBootCamps_within_radius ) ;


router.route('/')
    .get( getAllBootCamps )
    .post(is_auth, restrictTo('publisher', 'admin'), addBootCamp )


router.route('/:id')
    .get( getBootCamp )
    .patch(
      is_auth,
      restrictTo('publisher', 'admin'),
      is_managed_by_owner(BootCamp),
      uploadPhoto_bootCamp,
      resizePhoto('bootCamps', [2000, 1333]),
      updateBootCamp 
    )
    .delete(
      is_auth,
      restrictTo('publisher', 'admin'),
      is_managed_by_owner(BootCamp),
      deleteBootCamp 
    )

// remove bootCamp photo
// router.put('/:id/photo', )


export default router;





