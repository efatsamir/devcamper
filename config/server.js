import app from '../app.js';
import colors from 'colors';
import config from './config.js';
import DB_connect from './db.js';
const { PORT, NODE_ENV } = config;



// DB Connect
DB_connect();

app.listen(
    PORT,
    () => console.log(`Server is running in ${NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

 
// handle uncaught exceptions ( errors occur in synchronous code )
process.on('uncaughtException', err => {
    console.log('uncaughtException'); 
    console.log(err.name, err.message.red.underline.bold);
     process.exit(1);      
})

// create global handler for 
// unhandled promise rejections ( occur in asynchronous code )
process.on('unhandledRejection', err => {
    console.log('unHandledRejection');
    console.log(err.name, err.message.red.underline.bold);
    // close server & exit process
    server.close( () => process.exit(1) );
    
})