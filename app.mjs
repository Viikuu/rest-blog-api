import process from 'node:process';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import {authRouter} from './routes/auth.mjs';
import {userRouter} from './routes/users.mjs';
import {postRouter} from './routes/posts.mjs';
import {authenticateToken} from './utils/auth-middleware.mjs';

const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());

await mongoose.connect(process.env.MONGO_URL);

app.use('/api/auth', authRouter);

app.use(authenticateToken);

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

app.listen('5000', () => {
	console.log('Listening on http://localhost:5000');
});
