import { validationResult, matchedData } from 'express-validator';
import connectionDB from '../db_config/db_config.js';


const addNewOrder = (req, res) => {
    if (req.session.user) {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const data = matchedData(req);
            connectionDB.pool.escape();
            const sql = `INSERT INTO Orders (c_id, order_name, price, quntety, country) VALUES (${req.session.user.id}, '${data.order_name}', ${data.price}, ${data.quntety}, '${data.country}'); SELECT * FROM Orders WHERE c_id = '${req.session.user.id}';`;
            connectionDB.pool.query(sql, function (err, results) {
                if (err) {
                    res.status(401).send({ "ok": false, 'error': err }).end();
                } else {
                    if (req.session.order) {
                        req.session.order.push(results[1].length - 1);
                    } else {
                    
                      
                    }
                    req.session.order = results[1]
                    res.status(200).send({ "ok": true, msg: "NEW Order added" }).end();
                }
            });
        } else {
            res.status(401).send({ ok: false, errors: result.array()[0].msg }).end()
        }

    } else {
        res.status(401).send({ ok: false, msg: "LogIn requierd befor add an order" }).end()
    }
}


const getALLOrdersOneUser = (req, res) => {
    if (req.session.user) {
        req.session.order
            ? res.status(200).send({ "ok": true, msg: "All Orders", "orders": req.session.order }).end()
            : res.status(401).send({ ok: false, msg: "you do not have any order yet" }).end()

    } else {
        res.status(401).send({ ok: false, msg: "LogIn requierd befor add an order" }).end()
    }

}


const ordersController = { addNewOrder, getALLOrdersOneUser }

export default ordersController;