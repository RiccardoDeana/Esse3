function configClearError (page) {
    return function clearErrorMiddleware (req, res, next) {
        console.log(req.app.locals.error);
        if (req.app.locals.error && req.app.locals.error[page]) {
            const isErrorValid = req.app.locals.error[page].isErrorValid;
            if (isErrorValid) {
                req.app.locals.error[page].isErrorValid = false;
            } else {
                req.app.locals.error = {};
            }
        }
        next();
    };
}

module.exports = configClearError;