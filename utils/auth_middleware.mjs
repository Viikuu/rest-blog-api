import jwt from 'jsonwebtoken';

function authenticateToken(request, response, next) {
	const authHeader = request.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) return response.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, element) => {
		if (err) {
			console.log(err);
			request.redirect('/api/auth/login');
		}

		request.body._id = element._id;
		next();
	});
}

export {
	authenticateToken,
};
