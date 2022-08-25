import config from "../config/config.js";
const { JWT_COOKIE_EXPIRE, NODE_ENV } = config;

export const generate_cookie = jwt => {

  const exp = new Date( Date.now() + (JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 ));

  const options = {
      
      expires: exp,

       // activate this option in production 
      //secure: true,

       httpOnly: true,  
    }
    
    if ( NODE_ENV === 'production' ) options.secure = true;
    return [ 'jwt', jwt, options ];

}