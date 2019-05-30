const mysql = require('mysql');
const Promise = require('bluebird');
const configDatabase = require('../config.js');

class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

class Data {
    constructor() {
        this.database = new Database(configDatabase);
    }

    getUsers() {
        return this.database.query('SELECT * FROM users').then(rows => {
            return rows;
        });
    }

    getUserById(id) {
        return this.database.query('SELECT * FROM users WHERE id = ' + id).then(rows => {
            return rows;
        });
    }

    getUserByLoginAndPassword(login, password) {
        return this.database.query('SELECT * FROM users WHERE login = "' + login + '" AND password = "' + password + '"').then(rows => {
            return rows;
        });
    }

    insertUser(user, password, color = red, image = null) {
        let sql = 'INSERT INTO USERS (login, password, couleur, image) VALUES (' + user + ', ' + password + ', ' + color + ', ' + image + ')';
        return this.database.query(sql).then(rows => {
            return rows;
        });
    }

    changeProfileImage(id, image) {
        let sql = 'UPDATE users SET image = "' + image + '" WHERE id = ' + id;
        return this.database.query(sql).then(rows => {
            return rows;
        });
    }

    changeColorUser(id, color) {
        let sql = 'UPDATE users SET couleur = "' + color + '" WHERE id = ' + id;
        return this.database.query(sql).then(rows => {
            return rows;
        });
    }

    close() {
        this.database.close();
    }

}

module.exports = Data;
