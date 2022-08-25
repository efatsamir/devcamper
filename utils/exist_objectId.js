import { AppError } from './AppError';


const exist_objectId = (id, model) => {

  const doc_exists = await BootCamp.findById(id).select(' _id ');

  if(!doc_exists) {
    return next(new AppError(`${model} no longer exists or deleted!`, 404));
  }

  next();

}