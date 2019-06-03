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
        app.get('/api/profiles/:name', function (request, response) {
            let check = false;
            check = checkToken(request);
            if (check) {
                let name = request.params.name;
                return data.getUserByName(name).then(function (profile) {
                    if (profile !== undefined) {
                        response.setHeader(
                            'Access-Control-Allow-Origin',
                            'http://localhost:3000'
                        );
                        response.status(200).json({
                            profile: profile
                        });
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
                    response.status(200).json({
                        profiles: profile 
                    });
                });
            } else {
                response.status(400).json({
                    key: 'There is no Token!'
                });
            }
        });

        app.get('/api/profiles/changeImage/:name/:image', function (request, response) {
            let name = request.params.name;
            let image = request.params.image;
            let check = false;
            check = checkToken(request);
            if (check) {
                return data.changeProfileImage(name, image).then(function (profile) {

                    if (profile !== undefined) {
                        response.setHeader(
                            'Access-Control-Allow-Origin',
                            'http://localhost:3000'
                        );
                        response.status(200).json({
                            profile: profile
                        });
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

        app.get('/api/profiles/changeColor/:name/:color', function (request, response) {
            let name = request.params.name;
            let color = request.params.color;
            let check = false;
            check = checkToken(request);
            if (check) {
                return data.changeColorUser(name, color).then(function (profile) {
                    if (profile !== undefined) {
                        response.setHeader(
                            'Access-Control-Allow-Origin',
                            'http://localhost:3000'
                        );
                        response.status(200).json({
                            profile : profile
                        });
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

        app.get('/api/conversations', function (request, response) {
            let check = false;
            check = checkToken(request);
            if (check) {
                return data.getConversations().then(function (conversation) {
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
                    response.status(200).json({
                        conversations: conversation 
                    });
                });
            } else {
                response.status(400).json({
                    key: 'There is no Token!'
                });
            }
        });

        app.get('/api/messages/:id', function (request, response) {
            let check = false;
            check = checkToken(request);
            if (check) {
                let id = request.params.id;
                return data.getMessagesByConversation(id).then(function (message) {
                    if (message !== undefined) {
                        response.setHeader(
                            'Access-Control-Allow-Origin',
                            'http://localhost:3000'
                        );
                        response.status(200).json({
                            messages: message
                        });
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

        app.post('/api/addMessage', function (request, response) {
            let check = false;
            check = checkToken(request);
            if (check) {
                let idConv = request.body.idConv;
                let idAut = request.body.idAut;
                let content = request.body.content;
                return data.addMessage(idConv, idAut, content).then(function (message) {
                    if (message !== undefined) {
                        response.setHeader(
                            'Access-Control-Allow-Origin',
                            'http://localhost:3000'
                        );
                        response.status(200).json({
                            message: message
                        });
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
