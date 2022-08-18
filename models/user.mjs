import process from 'node:process';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

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
	return jwt.sign({
		_id: this._id,
		username: this.username,
	}, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15m',
	});
};

UserSchema.methods.generateRefreshToken = function (request) {
	const code = request.ip;
	this.refreshToken = code;
	return jwt.sign({code}, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '7d',
	});
};

const User = mongoose.model('User', UserSchema);

export {
	User,
};
