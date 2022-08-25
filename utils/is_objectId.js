import isValidObjectId from "mongoose";
import { AppError } from "./AppError.js";

// check if req.params.id is a valid mongoose objectId
const is_objectId = (id, Model) => { 
 if(!isValidObjectId( id )) {
  return next(new AppError(`Invalid ${Model} Id`, 400));
 }

}

export default is_objectId;
