import { AppError } from "../utils/AppError.js";

export const notFound = (req, res, next) => {
  const error = new AppError(`Not Found - ${req.originalUrl} !`, 404);
  next(error);
}