import express from 'express';
import { getUser } from '../controllers/user-controller.js';
import { emailSchema} from '../schema-validation/email.js';
import { passwordSchema } from '../schema-validation/password.js';
import { registerSchema } from '../schema-validation/register.js';
import { userUpdateSchema } from '../schema-validation/user.js';
import { resizePhoto } from '../utils/file_Upload.js';
import { register, login, forgot_password,
   getMe, reset_password, logout, updateMe, 
   updateAvatar, 
   deleteMe,
   updatePassword,
   send_verify_email,
   verify_email} from './../controllers/auth-controller.js';
import is_auth from './../middleware/is_auth.js';
import { validate } from './../middleware/validate.js';
import { loginSchema } from './../schema-validation/login.js';
const router = express.Router();


router.post('/signup', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);


router.post('/forgot-password', validate(emailSchema), forgot_password );
router.patch('/reset-password/:token', validate(passwordSchema), reset_password );

router.get('/verify-email', validate(emailSchema), send_verify_email );
router.get('/verify-email/:jwt', verify_email );


router.use( is_auth );
router.use( getMe );



router.get('/profile', getMe, getUser);

router.patch('/update-profile', 
  validate(userUpdateSchema),
  updateAvatar,
  resizePhoto('users', [500, 500]),
  updateMe
);


router.patch('/update-password', validate(passwordSchema),  updatePassword);

router.delete('/delete-profile', deleteMe);


export default router;