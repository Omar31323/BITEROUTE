//@ts-nocheck 
 const normalizePath = (req, res, next) => {
    if (req.file) {
        req.file.path = req.file.path.replace(/\\/g, '/');
        if (!req.file.path.startsWith('/')) req.file.path = '/' + req.file.path;
    }
    next();
};
export default normalizePath;