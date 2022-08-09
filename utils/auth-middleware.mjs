import process from 'node:process';
import jwt from 'jsonwebtoken';

function authenticateToken(request, response, next) {
	const authHeader = request.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) {
		return response.sendStatus(401);
	}

	try {
		const element = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		request._id = element._id;
		request.username = element.username;
		next();
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			response.status(401).json('Unauthorized, token expired');
		} else {
			response.sendStatus(401);
		}
	}
}

export {
	authenticateToken,
};
