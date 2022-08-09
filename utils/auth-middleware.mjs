import process from 'node:process';
import jwt from 'jsonwebtoken';

function authenticateToken(request, response, next) {
	const authHeader = request.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) {
		return response.sendStatus(401);
	}

		request.body._id = element._id;
		next();
	});
}

export {
	authenticateToken,
};
