import jwt from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        res.locals.isAdmin = false;
        res.locals.isWriter = false;
        return next();
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.locals.isAdmin = false;
                res.locals.isWriter = false;
                return next()
            }
            req.user = decoded;
            return next();
        });
    } catch (error) {
        return next();
    } 
}


export const isAdminOrWriter = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/admin/login');
    }

    const { isAdmin, isWriter } = req.user;
    if (!isAdmin && !isWriter) {
        res.clearCookie('access_token');
        return res.status(403).send(`
            <script>
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000); 
            </script>
            <h1 class="text-danger" style="color: red;">Access denied</h1>
        `); // Handle unauthorized access
    }

    // Set flags in res.locals for EJS template
    res.locals.isAdmin = isAdmin || false;
    res.locals.isWriter = isWriter || false;

    next();  // Call the next middleware
}