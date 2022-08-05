import express from 'express';
import {Category} from '../models/category.mjs';

const categoriesRouter = express.Router();

// Create Category

categoriesRouter.post('/', async (request, response) => {
	const newCategory = new Category(request.body);
	try {
		const savedCategory = await newCategory.save();
		response.status(200).json(savedCategory);
	} catch (error) {
		response.status(500).json(error);
	}
});

// GET Category

categoriesRouter.get('/', async (request, response) => {
	try {
		const Categories = await Category.find();
		response.status(200).json(Categories);
	} catch (error) {
		response.status(500).json(error);
	}
});

export {
	categoriesRouter,
};
