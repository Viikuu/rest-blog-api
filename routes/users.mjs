import express from 'express';
import {hash} from 'bcrypt';
import {User} from '../models/user.mjs';
import {Post} from '../models/post.mjs';

const userRouter = express.Router();

// Update user

userRouter.put('/:id', async (request, response) => {
	if (request.body._id === request.params.id) {
		if (request.body.password) {
			request.body.password = await hash(request.body.password, 10);
		}

		try {
			const updatedUser = await User.findByIdAndUpdate(request.params.id, {
				$set: request.body,
			}, {
				new: true,
			});
			response.status(200).json(updatedUser);
		} catch (error) {
			if (error.code === 11000){
				response.status(400).json('This username or email already exists');
			} else {
				response.status(500).json(error);
			}

		}
	} else {
		response.status(500).json('U can update only your account!');
	}
});

// Delete user

userRouter.delete('/:id', async (request, response) => {
	if (request.body._id === request.params.id) {
		try {
			const user = await User.findById(request.params.id);
			if (!user) {
				response.status(404).json('User not found!');
			} else {
				try {
					await Post.deleteMany({
						username: user.username,
					});
					await User.findByIdAndDelete(request.params.id);
					response.status(200).json('User deleted!');
				} catch (error) {
					response.status(500).json(error);
				}
			}
		} catch (error) {
			response.status(500).json(error);
		}
	} else {
		response.status(500).json('U can delete only your account!');
	}
});

// GET user

userRouter.get('/:id', async (request, response) => {
	try {
		const user = await User.findById(request.params.id);
		const {password, ...others} = user._doc;
		response.status(200).json(others);
	} catch (error) {
		response.status(500).json(error);
	}
});

export {
	userRouter,
};
