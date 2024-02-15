import { validationResult, matchedData } from 'express-validator';
import connectionDB from '../db_config/db_config.js';
import url from 'url';

const connectToDataBASE = (req, res) => {
    // console.log(req.cookies);
    // console.log(req.signedCookies);
    // console.log(req.session);
    // console.log(req.sessionID);
    connectionDB.pool.escape();
    const sql = 'SELECT * FROM Users';
    connectionDB.pool.query(sql, function (err, result) {
        if (err) {
            res.send({ "ok": false, 'error': err });
            res.end();
        } else {
            res.send({ "ok": true, "result": result });
            res.end();
        }
    });
}


const validatUserQuery = (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const data = matchedData(req);
        return res.status(200).send(`Hello, ${data.person}!`);
    }
    res.send({ errors: result.array()[0].msg });
    res.end();
}

const readQueryFromString = (req, res) => {
    var q = url.parse(req.url, true).query; //Split the Query String
    var txt = q.year + "-" + q.month;
    res.status(200).send(txt); //write a response to the client
    return res.end(); //end the response
}


const signUpNewUser = (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const data = matchedData(req);
        connectionDB.pool.escape();
        const sql = `INSERT INTO Users (name, mail, pass_word, age, country) VALUES ('${data.name}', '${data.mail}', '${data.pass_word}', ${data.age}, '${data.country}'); SELECT * FROM Users WHERE mail = '${data.mail}' AND pass_word = '${data.pass_word}' ;`;
        connectionDB.pool.query(sql, function (err, result) {
            if (err) {
                res.status(401).send({ "ok": false, 'error': err }).end();
            } else {
                req.session.user = result[1][0];
                res.cookie('notSignedCookie', 'Hello World', { maxAge: 60000 * 60, httpOnly: true });
                res.cookie('signedCookie', 'Hello World s', { maxAge: 60000 * 60, signed: true, httpOnly: true, secure: true });
                res.status(200).send({ "ok": true, msg: "updated successfully", "result": result[1][0] }).end();
            }
        });

    } else {
        res.status(404).send({ errors: result.array()[0].msg });
    }

}


const logInUser = (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const data = matchedData(req);
        connectionDB.pool.escape();
        const sql = `SELECT * FROM Users WHERE mail = '${data.mail}' AND pass_word = '${data.pass_word}';`;
        connectionDB.pool.query(sql, function (err, result) {
            if (err) {
                res.status(401).send({ "ok": false, 'error': err }).end();
            } else {
                req.session.user = result[0];
                res.cookie('notSignedCookie', 'Hello World', { maxAge: 60000 * 60, httpOnly: true });
                res.cookie('signedCookie', 'Hello World s', { maxAge: 60000 * 60, signed: true, httpOnly: true, secure: true });
                res.status(200).send({ "ok": true, msg: "logged in account successfully", "result": result[0] ?? 'email not exist' }).end();
            }
        });
    } else {
        res.status(401).send({ errors: result.array()[0].msg }).end
    }

}


const updateUserInfo = (req, res) => {
    if (req.session.user) {
        const user = req.session.user;
        const result = validationResult(req);
        if (result.isEmpty()) {
            const data = matchedData(req);
            connectionDB.pool.escape();
            const sql = `UPDATE Users SET name = '${data.name ?? user.name}', mail = '${data.mail ?? user.mail}', pass_word = '${data.pass_word ?? user.pass_word}', age = ${data.age ?? user.age}, country = '${data.country ?? user.country}' WHERE id = ${user.id}; SELECT * FROM Users WHERE id = ${user.id};`;
            connectionDB.pool.query(sql, function (err, result) {
                if (err) {
                    res.status(401).send({ "ok": false, 'error': err }).end();
                } else {
                    req.session.user = result[1][0];
                    res.cookie('notSignedCookie', 'Hello World', { maxAge: 60000 * 60, httpOnly: true });
                    res.cookie('signedCookie', 'Hello World s', { maxAge: 60000 * 60, signed: true, httpOnly: true, secure: true });
                    res.status(200).send({ "ok": true, msg: "updated successfully", "result": result[1][0] ?? 'Some thing went wrong try again' }).end();
                }
            });
        } else {
            res.status(401).send({ errors: result.array()[0].msg }).end
        }

    } else {
        res.status(401).send({
            ok: false, msg: "LogIn is requerd befoer update your account"
        }).end();
    }
}


const getProfileUser = (req, res) => {
    if (req.session.user) {
        res.status(200).send(req.session.user).end();
    } else {
        res.status(401).send({ ok: false, msg: "No user logged in found" }).end();
    }
}

const deleteUser = (req, res) => {
    if (req.session.user) {
        const id = req.session.user.id;
        connectionDB.pool.escape();
        const sql = `SET FOREIGN_KEY_CHECKS=OFF; DELETE FROM Users WHERE id = ${id}; SET FOREIGN_KEY_CHECKS=ON`;
        connectionDB.pool.query(sql, function (err, result) {
            if (err) {
                res.status(401).send({ "ok": false, 'error': err }).end();
            } else {
                req.session.user = null;
                req.session.destroy();
                res.clearCookie('notSignedCookie');
                res.clearCookie('signedCookie');
                res.status(200).send({ "ok": true, msg: "Deleted account successfully"}).end();
            }
        });

    } else {
        res.status(401).send({ ok: false, msg: "Befor delete your account you should logIn into your account" }).end();

    }
}


const siginOut = async (req, res) => {
    if (req.session.user) {
        req.session.user = null;
        await res.clearCookie('notSignedCookie');
        await res.clearCookie('signedCookie');
        res.status(200).send({ ok: true, msg: "signed out successfully " }).end();
    } else {
        res.status(401).send({ ok: false, msg: "No user logIn found" }).end();
    }

}

const userControllerMethods = { connectToDataBASE, readQueryFromString, validatUserQuery, signUpNewUser, logInUser, getProfileUser, updateUserInfo, deleteUser, siginOut }

export default userControllerMethods;
