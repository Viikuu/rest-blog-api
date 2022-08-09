import process from 'node:process';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {authRouter} from './routes/auth.mjs';
import {userRouter} from './routes/users.mjs';
import {postRouter} from './routes/posts.mjs';
import {authenticateToken} from './utils/auth_middleware.mjs';

const app = express();

dotenv.config();
app.use(express.json());

await mongoose.connect(process.env.MONGO_URL);

app.use('/api/auth', authRouter);

app.use(authenticateToken);

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

app.listen('5000', () => {
	console.log('Listening on http://localhost:5000');
});