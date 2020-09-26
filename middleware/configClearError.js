// middleware/configClearError.js

// Elimina l'errore in caso di refresh della pagina
function configClearError (page) {
    return function clearErrorMiddleware (req, res, next) {
        if (req.app.locals.error && req.app.locals.error[page]) {
            const isErrorValid = req.app.locals.error[page].isErrorValid;
            if (isErrorValid) {
                req.app.locals.error[page].isErrorValid = false;
            } else {
                req.app.locals.error = {};
            }
        }
        if (req.app.locals.success && req.app.locals.success[page]) {
            const isSuccessValid = req.app.locals.success[page].isSuccessValid;
            if (isSuccessValid) {
                req.app.locals.success[page].isSuccessValid = false;
            } else {
                req.app.locals.success = {};
            }
        }
        next();
    };
}

module.exports = configClearError;