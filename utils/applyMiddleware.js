import path from 'path';
import express from 'express';
import logger from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from '../config/config.js';
const { NODE_ENV } = config;


function applyMiddleware(app) {

// set security http headers, should be in the top of all middleware
app.use(helmet());

// allow logger (morgan) in dev only
if (NODE_ENV === 'development') {
  app.use(logger('dev'));
}
  

const limiter = rateLimit({
  // allow 100 request / 10 mins
  max: 100, 
  windowMs: 10 * 60 * 1000,  // 10 mins,
  message: 'too many requests, please try again in 10 minutes!'
})
app.use('/api', limiter);



app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

// Data sanitization against NoSQL query injection
// look at the req.body, req.query-string & req.params to filter out all dots & $ cuz 
// this how mongodb are written 
app.use( mongoSanitize() );

// Data sanitization against XSS 
// will clean any user input from malicious html or JS code
app.use( xss() );

// prevent parameter pollution
app.use( hpp() );



app.use(cors());


// set static folder
//  __dirname ==> only available in common js, not es6 module but we mimic that by:
const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, 'public')));


}

export default applyMiddleware;

