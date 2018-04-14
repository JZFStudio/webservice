const mysql = require('mysql');

function main(query, data) {
    return new Promise(function (resolve, reject) {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'fei0099lei',
            database: 'mysql',
            connectTimeout: 1000 * 10
        });
        connection.connect();
        console.log(data);
        connection.query(query, data, function (err, res) {
            if (err) {
                console.log('[SELECT ERROR] - ' + err.message);
                reject(err.message);
            }
            console.log('--- select ---');
            console.log(res);
            resolve(res);
            console.log('--- end ---');
        });
        connection.end();
    })
}

function getMySql() {
    return main('SELECT * FROM db');
}

function addInfo(data) {
    return main('INSERT INTO info SET ?', data);
}

module.exports = {
    getMySql,
    addInfo
};