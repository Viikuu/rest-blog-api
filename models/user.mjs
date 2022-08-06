import process from 'node:process';
import mongoose from 'mongoose';
import {sign} from 'jsonwebtoken';


const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		refreshToken: {
			type: String,
			required: false,
		},
	},
	{timestamps: true},
);

UserSchema.methods.generateAuthToken = function () {
	return sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '15m',
	});
};

UserSchema.methods.generateRefreshToken = function () {
	const token = sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '7d',
	});
	this.refreshToken = token;
	return token;
};

const User = mongoose.model('User', UserSchema);

export {
	User,
};
