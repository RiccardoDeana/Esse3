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
        next();
    };
}

module.exports = configClearError;