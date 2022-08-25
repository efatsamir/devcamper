import mongoose from "mongoose";
import  asyncHandler  from 'express-async-handler';
import { AppError } from "../utils/AppError.js";


const valid_exist_objectId =  model => asyncHandler(async (req, res, next) => {
  
  if(!mongoose.isValidObjectId( req.params.id )) {
    return next (
      new AppError(`Invalid ${model.modelName} Id`, 400)
    );
  }

  const doc_exists = await model.findById(req.params.id ).select(' _id ');

  if(!doc_exists) {
   
    return next(
      new AppError(`${model.modelName} no longer exists or deleted!`, 404)
    );
  }


  next();

});

export default valid_exist_objectId;