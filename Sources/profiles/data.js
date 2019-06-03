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

    getUserByName(login) {
        return this.database.query('SELECT * FROM users WHERE login = "' + login + '"').then(rows => {
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

    changeProfileImage(name, image) {
        let sql = 'UPDATE users SET image = "' + image + '" WHERE name = "' + name + '"';
        return this.database.query(sql).then(rows => {
            return rows;
        });
    }

    changeColorUser(name, color) {
        let sql = 'UPDATE users SET couleur = "' + color + '" WHERE name = "' + name + '"';
        return this.database.query(sql).then(rows => {
            return rows;
        });
    }

    getConversations() {
        return this.database.query('SELECT * FROM conversations').then(rows => {
            return rows;
        });
    }

    getMessagesByConversation(idConv) {
        return this.database.query('SELECT messages.*, users.login, users.couleur, users.image FROM messages INNER JOIN users ON users.id = messages.idAuteur WHERE idConversation = ' + idConv).then(rows => {
            return rows;
        });
    }

    addMessage(idConv, idAut, content) {
        let sql = 'INSERT INTO messages (idConversation, idAuteur, contenu) VALUES (' + idConv + ', ' + idAut + ', "' + content + '")';
        return this.database.query(sql).then(rows => {
            return rows;
        });
    }

    close() {
        this.database.close();
    }

}

module.exports = Data;
