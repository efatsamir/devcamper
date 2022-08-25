import config from './../config/config.js'
const { NODE_ENV } = config;




// err consists of msg & stack
export const errorHandler = (err, req, res, next) => {
  


  const statusCode = err.statusCode  
  ? err.statusCode 
  :res.statusCode === 200 ? 500 : res.statusCode ;

  // const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
 

  res
    .status(statusCode)
    .json({
      success: false,
      error: {
        message: err.message || 'Server Error!',
        stack: NODE_ENV === 'production' ? null : err.stack,
        errors: err.errors || {}
      }
  })
}