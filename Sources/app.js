const express = require("express");
const bodyParser = require("body-parser");
const Profiles = require("./profiles/controller");
const Data = require("./profiles/data");
const packageJson = require("../package.json");
let jwt = require('jsonwebtoken');
let config = require('./configJWT');
let middleware = require('./middleware');
let data = new Data();

class HandlerGenerator {
    login(req, res) {
        let username = req.body.username;
        let password = req.body.password;

        let mockedUsername = 'false';
        let mockedPassword = 'false';
        if (data.getUserByLoginAndPassword(username, password) != null) {
            mockedUsername = req.body.username;
            mockedPassword = req.body.password;
        }

        if (username && password) {
            if (username === mockedUsername && password === mockedPassword) {
                let token = jwt.sign({ username: username },
                    config.secret,
                    {
                        expiresIn: '24h' // expires in 24 hours
                    }
                );
                // return the JWT token for the future API calls
                res.json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token
                });
            } else {
                res.send(403).json({
                    success: false,
                    message: 'Incorrect username or password'
                });
            }
        } else {
            res.send(400).json({
                success: false,
                message: 'Authentication failed! Please check the request'
            });
        }
    }
    index(req, res) {
        res.json({
            success: true,
            message: 'Index page'
        });
    }
}

class App {
    constructor() {
        const app = express();

        let handlers = new HandlerGenerator();

        app.use(
            bodyParser.urlencoded({
                extended: true
            })
        );
        app.use(bodyParser.json());

        var middlewareHttp = function (request, response, next) {
            response.setHeader("Api-version", packageJson.version);
            response.setHeader("Content-Type", "application/json");

            console.log(`${request.method} ${request.originalUrl}`);
            if (request.body && Object.keys(request.body).length > 0) {
                console.log(`request.body ${JSON.stringify(request.body)}`);
            }
            next();
        };
        app.use(middlewareHttp);



        app.post('/login', handlers.login);
        app.get('/', middleware.checkToken, handlers.index);
        new Profiles(app, data);
        app.get("/api/version", function (request, response) {
            response.json({
                version: packageJson.version
            });
        });

        app.get("*", function (request, response) {
            response.status(404).json({
                key: "not.found"
            });
        });

        // eslint-disable-next-line no-unused-vars
        app.use(function (error, request, response, next) {
            console.error(error.stack);
            response.status(500).json({
                key: "server.error"
            });
        });

        this.app = app;
    }
}

module.exports = App;
