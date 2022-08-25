import path from 'path';
import multer from "multer";
import sharp from "sharp";
import { v4 } from "uuid";
import validator from "validator";
import config from './../config/config.js';
import { AppError } from './AppError.js';
import  asyncHandler  from 'express-async-handler';
const { FILE_UPLOAD_PATH, MAX_FILE_UPLOAD } = config;


 //  const  filetypes = /jpg|jpeg|png/;
  //  const extname =  filetypes.test(path.extname(file.originalname).toLowerCase())
  //  const mimeType = filetypes.test(file.mimetype)

  //  if (extname && mimeType) cb(null, true)
  //  else cb(new CustomError('Not an image, please upload only images', 400), false);

  // validator.isMimeType('image');

const multer_storage = multer.memoryStorage();

const multer_filter = (req, file, cb) => {
  
  
  // check if file uploaded is an image 
  if (file.mimetype.startsWith('image')) {
     cb(null, true)
  }else {
    cb(new AppError('Not an image, please upload only images', 400), false);
  }

  // check file size
  if( file.size > MAX_FILE_UPLOAD) {
    cb(new AppError('Please upload an image less than 1 MB', 400), false);
  }else {
    cb(null, true)
  }
}

const upload = multer({
  storage: multer_storage,
  fileFilter: multer_filter
})

////////////////////////////////////////////////////////////////////

// upload.single('photo') =========================> req.file
export const upload_one_photo = photoName => upload.single(photoName);
 

// upload.fields([
//     {name: 'imageCover', maxCount: 1},
//     {name: 'images',  maxCount: 3}
// ])  ============================================> req.files
export const  upload_many_photos = arr_of_objects  => {
  return upload.fields(arr_of_objects);
}
   
///////////////////////////////////////////////////////////////////////////////

// folder => users or bootCamps
// size => 2000, 1333 or 500, 500
export const resizePhoto = (folder, size) => asyncHandler(async (req, res, next) => {
  

  if (!req.file) return next();
  
   // path.parse(req.file.filename).ext
  // req.file.filename = `${fieldname}-${v4()}${path.extname(originalname)}`;

  const { fieldname, originalname, buffer } = req.file;
  req.file.filename = `${fieldname}-${v4()}${path.extname(originalname)}`;

  await sharp(buffer)
      .resize(...size)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      // .toFormat( path.extname(originalname) ) // not working ???
      .toFile(`${FILE_UPLOAD_PATH}/${folder}/${req.file.filename}`);

  req.body[fieldname] = req.file.filename;
  
 
  next();
  
  
})











