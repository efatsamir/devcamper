import express from 'express'
import is_auth from '../middleware/is_auth.js';
import valid_exist_objectId from '../middleware/valid_exist_objectId.js';
import Review from '../models/Review.js';
import { addReview, deleteReview, getAllReviews, getReview, updateReview } from './../controllers/review-controller.js';
import { restrictTo } from './../middleware/restrictTo.js';
import { is_managed_by_owner } from './../middleware/is_managed_by_owner.js';



const router = express.Router({ mergeParams: true });


// middleware to check if id is valid objectId & exist in DB
router.use('/:id/:resource?', valid_exist_objectId(Review));

router.route('/')
      .get( getAllReviews )
      .post( is_auth, restrictTo('user'), addReview )


router.route('/:id')
      .get( getReview )
      .patch(is_auth, restrictTo('user', 'admin'), is_managed_by_owner(Review), updateReview )
      .delete(is_auth, restrictTo('user', 'admin'), is_managed_by_owner(Review), deleteReview )



export default router;