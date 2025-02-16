import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();
app.use(cors(
  {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }
));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// importing routes
import userRouter from './routes/user.route.js';
import expenseRouter from './routes/expense.route.js';
import subscriptionRouter from './routes/subscription.route.js';



// using routes

app.use('/api/v1/users', userRouter);

// routes for expenses

app.use('/api/v1', expenseRouter);

// routes for subscription

app.use('/api/v1/subscription', subscriptionRouter);








export { app };




