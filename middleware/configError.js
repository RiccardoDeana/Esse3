// middleware/configError.js

// Aggiunge il messaggio di errore alla pagina
function configError (page, errorMessage, res) {
        const target = res.locals.error || {};
        Object.assign(target,
            {
                [page]: {
                    msg: errorMessage,
                    isErrorValid: true
                }
            });
        res.locals.error = target;
        res.status(400).render(page);
}

module.exports = configError;