import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import allRouters from './src/routing/my_router.js';
import morgan from 'morgan';


const PORT = process.env.port || 3008;
const app = express();
app.use(cookieParser('Abo Omar'));// gaven secret name for accpet secuer cookies

const sess = {
    secret: 'Abo Omar',
    name: 'test',
    resave: false,
    saveUninitialized: false,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: 60000 * 60 }
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1)
    sess.cookie.secure = true
}
app.use(morgan('dev'));
app.use('/', express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sess))
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