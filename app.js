const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const app = express();
require('./db');

const port = process.env.PORT;

const indexController = require('./controllers/indexController');
const indexRouter = require('./routers/index')(indexController);
/*
const indexRoutesController = require('./controllers/indexRoutesController');
const usersRoutesController = require('./controllers/usersRoutesController');


app.use('/utenti', usersRoutes);
*/
app.use('/', indexRouter);
app.use('/login', indexRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    //res.locals.error = req.app.get('env') === 'development' ? err : {};
    if(req.app.get('env') === 'development'){
        res.locals.error = err;
    }else{
        res.locals.error = {};
    }
    // render the error page
    res.status(err.status || 500);
    //res.render('error');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
