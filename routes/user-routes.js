import express from 'express';
import { getAllUsers, getUser, updateUser, deleteUser, addUser
} from '../controllers/user-controller.js';
import is_auth from '../middleware/is_auth.js';
import { restrictTo } from '../middleware/restrictTo.js';
import User from '../models/User.js';
import valid_exist_objectId from './../middleware/valid_exist_objectId.js';


const router = express.Router();

router.use('/:id', valid_exist_objectId(User));
router.use( is_auth );
router.use( restrictTo('admin') );

router.route('/')
      .get( getAllUsers )
      .post( addUser )
     


router.route('/:id')
      .get( getUser )
      .patch( updateUser )
      .delete( deleteUser )




export default router;





