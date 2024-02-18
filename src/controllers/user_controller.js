
import connectionDB from '../db_config/db_config.js';
import url from 'url';
import helperMehtod from '../utilities/helper.js';
import validatorSrv from '../utilities/validations.js';

const connectToDataBASE = async (req, res) => {
    // console.log(req.cookies);
    // console.log(req.signedCookies);
    console.log(req.session);
    console.log(req.sessionID);
    // res.cookie('notSignedCookie', 'Hello World', { maxAge: 60000 * 60, httpOnly: true });
    // res.cookie('signedCookie', 'Hello World s', { maxAge: 60000 * 60, signed: true, httpOnly: true, secure: true });

    connectionDB.pool.escape();
    const sql = 'SELECT * FROM Users';
    connectionDB.pool.query(sql, function (err, result) {
        if (err) {
            res.status(400).send({ "ok": false, 'error': err }).end();

        } else {
            return res.status(200).send({ "ok": true, "result": result }).end();
        }
    });
}


const validatUserQuery = async (req, res) => {
    try {
        const data = await validatorSrv.valiedReqResult(req);
        res.status(200).send(`Hello, ${data.person}!`).end();

    } catch (error) {
        res.send({ errors: error }).end();
    }
}

const readQueryFromString = (req, res) => {
    var q = url.parse(req.url, true).query; //Split the Query String
    var txt = q.year + "-" + q.month;
    res.status(200).send(txt); //write a response to the client
    return res.end(); //end the response
}


const signUpNewUser = async (req, res) => {
    try {
        const data = await validatorSrv.valiedReqResult(req);
        data.pass_word = await helperMehtod.hashUserPassWord(data.pass_word);
        connectionDB.pool.escape();
        const sql = `INSERT INTO Users (name, mail, pass_word, age, country) VALUES ('${data.name}', '${data.mail}', '${data.pass_word}', ${data.age}, '${data.country}'); SELECT * FROM Users WHERE mail = '${data.mail}' AND pass_word = '${data.pass_word}' ;`;
        connectionDB.pool.query(sql, function (err, result) {
            if (err) {
                res.status(400).send({ "ok": false, 'error': err.code ?? 'SOME THING WENT WRONG!!' }).end();
            } else {
                const newUser = {
                    "id": result[1][0].id,
                    "name": result[1][0].name,
                    "mail": result[1][0].mail
                }
                req.session.user = newUser;
                res.status(200).send({ "ok": true, msg: "Created new account successfully", "result": newUser }).end();
            }
        });
    } catch (error) {
        res.status(400).send({ errors: error }).end();
    }
}


const logInUser = async (req, res) => {
    try {
        const data = await validatorSrv.valiedReqResult(req);
        connectionDB.pool.escape();
        const sql = `SELECT * FROM Users WHERE mail = '${data.mail}';`;
        connectionDB.pool.query(sql, async function (err, result) {
            if (err) {
                res.status(400).send({ "ok": false, 'error': err.code ?? 'some thing went wrong try again' }).end();
            } else {
                if (result[0] != null) {
                    const hashed = result[0]['pass_word'];
                    const checkHshed = await helperMehtod.compareHashPassWord(data.pass_word, hashed);
                    if (checkHshed) {
                        const newUser = {
                            "id": result[0].id,
                            "name": result[0].name,
                            "mail": result[0].mail
                        }
                        req.session.user = newUser;
                        res.status(200).send({ "ok": true, msg: "logged in account successfully", "result": newUser }).end();
                    } else {
                        res.status(404).send({ "ok": false, msg: "No user found", "result": null }).end();
                    }

                } else {
                    res.status(404).send({ "ok": false, msg: "No user found", "result": null }).end();
                }

            }
        });
    } catch (error) {
        res.status(400).send({ errors: error }).end();
    }
}


const updateUserInfo = async (req, res) => {
    if (req.session.user) {
        const user = req.session.user;
        try {
            const data = await validatorSrv.valiedReqResult(req);
            if (data.pass_word != null) {
                data.pass_word = await helperMehtod.hashUserPassWord(data.pass_word);
            }
            connectionDB.pool.escape();
            const sql = `UPDATE Users SET name = '${data.name ?? user.name}', mail = '${data.mail ?? user.mail}'  WHERE id = ${user.id}; SELECT * FROM Users WHERE id = ${user.id};`;
            connectionDB.pool.query(sql, function (err, result) {
                if (err) {
                    res.status(401).send({ "ok": false, 'error': err }).end();
                } else {
                    const newUsers = {
                        "id": result[1][0].id,
                        "name": result[1][0].name,
                        "mail": result[1][0].mail
                    }
                    req.session.user = newUsers;
                    res.status(200).send({ "ok": true, msg: "updated successfully", "result": newUsers ?? 'Some thing went wrong try again' }).end();
                }
            });

        } catch (error) {
            res.status(401).send({ errors: error }).end();

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
                res.status(200).send({ "ok": true, msg: "Deleted account successfully" }).end();
            }
        });

    } else {
        res.status(401).send({ ok: false, msg: "Befor delete your account you should logIn into your account" }).end();

    }
}


const siginOut = async (req, res) => {
    if (req.session.user) {
        req.session.user = null;
        req.session.destroy();
        res.status(200).send({ ok: true, msg: "signed out successfully " }).end();
    } else {
        res.status(401).send({ ok: false, msg: "No user logIn found" }).end();
    }

}

const userControllerMethods = { connectToDataBASE, readQueryFromString, validatUserQuery, signUpNewUser, logInUser, getProfileUser, updateUserInfo, deleteUser, siginOut }

export default userControllerMethods;
