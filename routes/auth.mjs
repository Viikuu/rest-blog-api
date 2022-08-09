import process from 'node:process';
import express from 'express';
import {compare, genSalt, hash} from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User} from '../models/user.mjs';
import {createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken} from '../utils/tokens.mjs';
import {Token} from '../models/tokenblacklist.mjs';

const authRouter = express.Router();

// Register

authRouter.post('/register', async (request, response) => {
	try {
		const salt = await genSalt(10);
		const hashedPass = await hash(request.body.password, salt);
		const newUser = new User({
			username: request.body.username,
			email: request.body.email,
			password: hashedPass,
			refreshToken: '',
		});
		const user = await newUser.save();

		response.status(200).json(user);
	} catch (error) {
		if (error.code === 11000) {
			response.status(400).json('This username or email already exists');
		} else {
			response.status(500).json(error);
		}
	}
});

// LOGIN

authRouter.post('/login', async (request, response) => {
	try {
		const user = await User.findOne({
			username: request.body.username,
		});
		if (!user) {
			response.status(400).json('Wrong credentials!');
		} else {
			const validate = await compare(request.body.password, user.password);
			if (!validate) {
				response.status(400).json('Wrong credentials!');
			} else {
				request.body._id = user._id;
				sendRefreshToken(response, await createRefreshToken(user));
				sendAccessToken(request, response, await createAccessToken(user));
				await User.findByIdAndUpdate(user._id, {
					$set: user,
				}, {
					new: true,
				});
			}
		}
	} catch (error) {
		response.status(500).json(error);
	}
});

authRouter.post('/logout', async (request, response) => {
	try {
		const authHeader = request.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		if (token !== null) {
			const id = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

			if (id) {
				const newToken = new Token({
					name: token,
				});
				await newToken.save();
			}
		}

		const code = jwt.verify(request.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const user = User.find({
			code,
		});
		await User.findByIdAndUpdate(user._id, {
			code: '',
		}, {
			new: true,
		});
	} catch (error) {
		if (error.code !== 11000 && error.name !== 'TokenExpiredError' && error.name !== 'JsonWebTokenError') {
			console.error(error);
		}
	}

	response.clearCookie('refreshToken');
	response.send({
		message: 'Logged out successfully',
	});
});

export {
	authRouter,
};
