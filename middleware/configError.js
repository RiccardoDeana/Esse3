/*function configError (page, errorMessage) {
    return function errorMiddleware (error, req, res) {
        console.log(page)
        console.log(error);
        const target = res.locals.error || {};
        Object.assign(target,
            {
                [page]: {
                    msg: errorMessage || error.message,
                    isErrorValid: true
                }
            });
        res.locals.error = target;
        res.status(400).render(page);
    };
}*/

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