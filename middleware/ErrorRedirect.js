// middleware/ErrorRedirect.js

// Reindirizza alla pagina "page" aggiungendo il messaggio di errore
function errorRedirect (page, errorMessage, req, res) {
        const target = req.app.locals.error || {};
        Object.assign(target,
            {
                [page]: {
                    msg: errorMessage,
                    isErrorValid: true
                }
            });
        req.app.locals.error = target;
        res.redirect('/' + page);
}

module.exports = errorRedirect;