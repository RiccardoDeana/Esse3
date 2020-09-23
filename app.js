const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const app = express();
require('./db');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT;

const indexController = require('./controllers/indexController');
const examsController = require('./controllers/examsController');
const addStudentController = require('./controllers/addStudentController');
const addExamController = require('./controllers/addExamController');
const remStudentController = require('./controllers/remStudentController');
const passedController = require('./controllers/passedController');
const regGradeController = require('./controllers/regGradeController');
const registrationsController = require('./controllers/registrationsController');

const indexRouter = require('./routers/indexRouter')(indexController);
const examsRouter = require('./routers/examsRouter')(examsController);
const addStudentRouter = require('./routers/addStudentRouter')(addStudentController);
const addExamRouter = require('./routers/addExamRouter')(addExamController);
const remStudentRouter = require('./routers/remStudentRouter')(remStudentController);
const passedRouter = require('./routers/passedRouter')(passedController);
const regGradeRouter = require('./routers/regGradeRouter')(regGradeController);
const registrationsRouter = require('./routers/registrationsRouter')(registrationsController);

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

app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
