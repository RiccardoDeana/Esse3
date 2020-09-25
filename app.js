// app.js

const express = require('express');
const bodyParser = require('body-parser');

// Controllers
const indexController = require('./controllers/indexController');
const examsController = require('./controllers/examsController');
const addStudentController = require('./controllers/addStudentController');
const addExamController = require('./controllers/addExamController');
const remStudentController = require('./controllers/remStudentController');
const passedController = require('./controllers/passedController');
const regGradeController = require('./controllers/regGradeController');
const registrationsController = require('./controllers/registrationsController');

// Routers
const indexRouter = require('./routers/indexRouter')(indexController);
const examsRouter = require('./routers/examsRouter')(examsController);
const addStudentRouter = require('./routers/addStudentRouter')(addStudentController);
const addExamRouter = require('./routers/addExamRouter')(addExamController);
const remStudentRouter = require('./routers/remStudentRouter')(remStudentController);
const passedRouter = require('./routers/passedRouter')(passedController);
const regGradeRouter = require('./routers/regGradeRouter')(regGradeController);
const registrationsRouter = require('./routers/registrationsRouter')(registrationsController);

require('./db');

const app = express();

const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(indexRouter);
app.use(examsRouter);
app.use(addStudentRouter);
app.use(addExamRouter);
app.use(remStudentRouter);
app.use(passedRouter);
app.use(regGradeRouter);
app.use(registrationsRouter);
app.use(express.static(__dirname + '/views'));

app.set('view engine', 'ejs');

// Cattura l'errore 404 e lo invia all'error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});