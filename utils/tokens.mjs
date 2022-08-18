const sendAccessToken = (request, response, accessToken) => {
    response
        .status(200)
        .cookie('accessToken', accessToken, {
            httpOnly: true,
            path: '/api',
        })
        .send({
            _id: request.body._id,
        });
};

const sendRefreshToken = (response, refreshToken) => {
    response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/api',
    });
};

export {
    sendAccessToken,
    sendRefreshToken,
};
