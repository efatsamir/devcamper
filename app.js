import express from 'express';
import applyMiddleware from './utils/applyMiddleware.js';
import bootCampRouter from './routes/bootCamp-routes.js';
import courseRouter from './routes/course-routes.js';
import reviewRouter from './routes/review-routes.js';
import authRouter from './routes/auth-routes.js';
import userRouter from './routes/user-routes.js';
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js';




const app = express();

// Middleware
applyMiddleware(app);

// ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/bootCamps', bootCampRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/users', userRouter);



// handle requests didn't match above routes
app.use(notFound);

// Error Handler middleware
app.use(errorHandler);




export default app;