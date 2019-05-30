let jwt = require('jsonwebtoken');
const config = require('../configJWT.js');

function checkToken(req) {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token)
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

    if (token) {
        return jwt.verify(token, config.secret, (err) => {
            if (err) {
                return false;
            } else {
                return true;
            }
        });
    } else {
        return false;
    }
};

class Profiles {
    constructor(app, data) {
        app.get('/api/profiles/:id', function (request, response) {
            let check = false;
            check = checkToken(request);
            if (check) {
                let id = request.params.id;
                return data.getUserById(id).then(function (profile) {
                    console.log(profile);
                    if (profile !== undefined) {
                        response.setHeader(
                            'Access-Control-Allow-Origin',
                            'http://localhost:3000'
                        );
                        response.status(200).json(profile);
                        return;
                    }
                    response.status(404).json({
                        key: 'entity.not.found'
                    });
                });
            } else {
                response.status(400).json({
                    key: 'There is no Token!'
                });
            }
        });

        app.get('/api/profiles', function (request, response) {
            let check = false;
            check = checkToken(request);
            if (check) {
                return data.getUsers().then(function (profile) {
                    console.log(profile);
                    response.setHeader(
                        'Access-Control-Allow-Origin',
                        'http://localhost:3000'
                    );
                    response.setHeader(
                        'Access-Control-Allow-Headers',
                        'my-header-custom'
                    );
                    response.setHeader(
                        'Cache-Control',
                        'public, max-age=15'
                    );
                    response.status(200).json({ profiles: profile });
                });
            } else {
                response.status(400).json({
                    key: 'There is no Token!'
                });
            }
        });

        app.get('/api/profiles/changeImage/:id/:image', function (request, response) {
            let id = request.params.id;
            let image = request.params.image;
            let check = false;
            check = checkToken(request);
            if (check) {
                return data.changeProfileImage(id, image).then(function (profile) {

                    if (profile !== undefined) {
                        response.setHeader(
                            'Access-Control-Allow-Origin',
                            'http://localhost:3000'
                        );
                        response.status(200).json(profile);
                        return;
                    }
                    response.status(404).json({
                        key: 'entity.not.found'
                    });
                });
            } else {
                response.status(400).json({
                    key: 'There is no Token!'
                });
            }
        });

        app.get('/api/profiles/changeColor/:id/:color', function (request, response) {
            let id = request.params.id;
            let color = request.params.color;
            let check = false;
            check = checkToken(request);
            if (check) {
                return data.changeColorUser(id, color).then(function (profile) {
                    console.log(profile);
                    if (profile !== undefined) {
                        response.setHeader(
                            'Access-Control-Allow-Origin',
                            'http://localhost:3000'
                        );
                        response.status(200).json(profile);
                        return;
                    }
                    response.status(404).json({
                        key: 'entity.not.found'
                    });
                });
            } else {
                response.status(400).json({
                    key: 'There is no Token!'
                });
            }
        });
    }
}
module.exports = Profiles;
