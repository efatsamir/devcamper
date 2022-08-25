
import users from './../_data/users.js';
import courses from './../_data/courses.js';
import reviews from './../_data/reviews.js';
import bootCamps from '../_data/bootCamps.js';

import BootCamp from './../models/BootCamp.js';
import User from './../models/User.js';
import Review from './../models/Review.js';
import Course from './../models/Course.js';
import DB_connect from './db.js';




// DB connect
DB_connect();



// IMPORT DATA TO DB
const importData = async () => {

    try {

      await BootCamp.deleteMany();
      await User.deleteMany();
      await Review.deleteMany();
      await Course.deleteMany();
      
      // stop the validation to stop confirmPassword error when writing to DB
      await User.create(users, { validateBeforeSave: false });
      await BootCamp.create(bootCamps, { validateBeforeSave: false });
      await Course.create(courses);
      await Review.create(reviews);
      

      console.log('data imported'.green.inverse);
      
    } catch(err) {
        console.log(err.message.red.underline);
    }
    
    process.exit();
}

// DELETE ALL Data
const deleteData = async () => {
    try{
        await BootCamp.deleteMany();
         await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
       
       console.log('data deleted'.green.inverse);
       
    }catch(err) {
        console.log(err.red.inverse);
    }
    
    process.exit();
}



// 
if (process.argv[2] === '--i') {
    importData();
}else if
(process.argv[2] === '--d') {
    deleteData();
}