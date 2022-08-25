
import config from './config.js';
const { DB_URI } = config;
import mongoose  from 'mongoose';
import colors from 'colors'





const DB_connect = async ( ) => {
    const conn = await mongoose.connect( DB_URI );
    console.log( 'MongoDB connected Successfully'.cyan.underline );
   
}

export default DB_connect;













