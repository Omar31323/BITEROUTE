//@ts-nocheck
export const attachLocals = (req, res, next) => {
    res.locals.isAuth = req.session.isAuthenticated || false;
    res.locals.isAdmin = req.session.isAdmin || false;
    if (req.session.cart)
        res.locals.itemsCount = req.session.cart.length || 0;

    next();
}
