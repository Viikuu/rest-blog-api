import express from 'express';
import {Post} from '../models/post.mjs';

const postRouter = express.Router();

// Create post

postRouter.post('/', async (request, response) => {
	const newPost = new Post(request.body);
	try {
		const savedPost = await newPost.save();
		response.status(200).json(savedPost);
	} catch (error) {
		if (error.code === 11000) {
			response.status(400).json('This title already exists, try again with other title!');
		} else {
			response.status(500).json(error);
		}
	}
});

// Update post

postRouter.put('/:id', async (request, response) => {
	try {
		const post = await Post.findById(request.params.id);
		if (post.username === request.body.username) {
			const updatedPost = await Post.findByIdAndUpdate(request.params.id, {
				$set: request.body,
			}, {
				new: true,
			});
			response.status(200).json(updatedPost);
		} else {
			response.status(401).json('U can update only your post!');
		}
	} catch (error) {
		if (error.code === 11000) {
			response.status(400).json('This title already exists, try again with other title!');
		} else {
			response.status(500).json(error);
		}
	}
});

// Delete post

postRouter.delete('/:id', async (request, response) => {
	try {
		const post = await Post.findById(request.params.id);
		if (post.username === request.body.username) {
			await Post.findByIdAndDelete(request.params.id);
			response.status(200).json('Post deleted...');
		} else {
			response.status(401).json('U can delete only your post!');
		}
	} catch (error) {
		response.status(500).json(error);
	}
});

// Get all post

postRouter.get('/', async (request, response) => {
	const username = request.query.user;
	const categoryName = request.query.category;
	try {
		let posts;
		if (username) {
			posts = await Post.find({
				username,
			});
		} else if (categoryName) {
			posts = await Post.find({
				categories: {
					$in: [categoryName],
				},
			});
		} else {
			posts = await Post.find();
		}

		response.status(200).json(posts);
	} catch (error) {
		response.status(500).json(error);
	}
});

// Get one post

postRouter.get('/:id', async (request, response) => {
	try {
		const post = await Post.findById(request.params.id);
		response.status(200).json(post);
	} catch (error) {
		response.status(500).json(error);
	}
});

export {
	postRouter,
};
