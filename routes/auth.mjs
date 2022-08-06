import express from 'express';
import {compare, genSalt, hash} from 'bcrypt';
import {User} from '../models/user.mjs';
import {createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken} from '../utils/tokens.mjs';

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
		});
		const user = await newUser.save();

		response.status(200).json(user);
	} catch (error) {
		response.status(500).json(error);
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
				sendAccessToken(request, response, await createAccessToken(user));
				sendRefreshToken(response, await createRefreshToken(user));
				const {password, refreshToken, ...others} = user._doc;
				response.status(200).json(others);
			}
		}
	} catch (error) {
		response.status(500).json(error);
	}
});

authRouter.post('/logout',(request, response) => {
	response.clearCookie('refreshToken');
	response.send({
		message: 'Logged out successfully',
	});
})

export {
	authRouter,
};
