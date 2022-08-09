import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
	},
);
const Token = mongoose.model('Token', TokenSchema);

export {
	Token,
};
