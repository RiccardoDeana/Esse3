// messages/successRedirect.js

// Reindirizza alla pagina "page" aggiungendo il messaggio di successo
function successRedirect (page, message, req, res) {
    const target = req.app.locals.success || {};
    Object.assign(target,
        {
            [page]: {
                msg: message,
                isSuccessValid: true
            }
        });
    req.app.locals.success = target;
    res.status(200).redirect('/' + page);
}

module.exports = successRedirect;