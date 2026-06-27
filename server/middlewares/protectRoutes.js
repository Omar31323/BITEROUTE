//@ts-nocheck
export const protectRoutesMiddleware = (req, res, next) => {
    if (!res.locals.isAuth) {
        return res.status(401).json({
            statusCode: 401,
            emoji: '🔐',
            title: 'Login required',
            message: 'You need to be logged in to access this page.'
        });
    }
    else if (!res.locals.isAdmin && req.path.startsWith('/admin'))
        return res.status(403).json( {
            statusCode: 403,
            emoji: '🚫',
            title: 'Access denied',
            message: "You don't have permission to view this page."
        });
    next();

}