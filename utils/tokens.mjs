async function createAccessToken(user) {
	return user.generateAuthToken();

}

async function createRefreshToken(user) {
	return user.generateRefreshToken();
}

const sendAccessToken = (request, response, accessToken) => {
	response
		.status(200)
		.send({
		accessToken,
		_id: request.body._id,
	});
};

const sendRefreshToken = (response, refreshToken) => {
	response.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		path: '/api/auth/refreshToken',
	});
};

export {
	createAccessToken,
	createRefreshToken,
	sendAccessToken,
	sendRefreshToken,
};
