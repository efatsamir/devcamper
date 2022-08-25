import  validator from 'validator';
import { AppError } from './AppError.js';

const is_valid_jwt = token => {
 if ( !validator.isJWT(token) ) 
    return new AppError('please provide a valid JWT', 400)
    
}

export default is_valid_jwt;