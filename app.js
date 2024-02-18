import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import MySQLStore from 'express-mysql-session';
import allRouters from './src/routing/my_router.js';
import connectionDB from './src/db_config/db_config.js';



const PORT = process.env.port || 3008;
const app = express();
app.use(cookieParser('Abo Omar'));

const sessionStore = new (MySQLStore(session))(connectionDB.options);

const sessionOptions = {
    secret: 'Abo Omar',
    store: sessionStore,
    name: 'test',
    resave: false,
    saveUninitialized: false,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: 60000 * 60 }
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1)
    sessionOptions.cookie.secure = true
}
app.use(morgan('dev'));
app.use('/', express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));
app.use(allRouters);
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.locals.error = err;
    const status = err.status || 500;
    res.status(status).send({ 'error': 'Bad request' }).end();
});
app.listen(PORT, () => console.log(' Server start on port : ' + PORT));

// sudo npm cache clean -f
// sudo npm install -g n
// sudo n stable