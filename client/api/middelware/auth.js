const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        res.locals.isAdmin = false;
        res.locals.isWriter = false;
        res.locals.isAuthenticated = false;
        res.locals.name = null;
        res.locals.resume = false;
        return next();
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.locals.isAdmin = false;
                res.locals.isWriter = false;
                res.locals.resume = false; 
                res.locals.name = null;
                return next()
            }
            req.user = decoded;
            res.locals.isAuthenticated = true;
            res.locals.name = decoded.name || null;
            res.locals.resume = false; 
            return next();
        });
    } catch (error) {
        res.locals.isAuthenticated = false;
        res.locals.isAdmin = false;
        res.locals.isWriter = false;
        res.locals.resume = false; 
        res.locals.name = null;
        return next();
    } 
}


const isAdminOrWriter = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/admin/login');
    }

    const { isAdmin, isWriter } = req.user;
    if (!isAdmin && !isWriter) {
        res.clearCookie('access_token');
        return res.status(403).send(`
            <div class="container" style="text-center">
                <div>
                    <h1 class="text-danger " style="color: red;">Access denied</h1>
                    <p>You are not authorized to access this page.</p>
                    <p>
                        Redirecting to the home page... in <span id="countdown">5</span> seconds or 
                        <span><a href="/">click here</span>
                    </p>
                </div>
            </div>
            <script>
                let countdown = 5;
                const countdownEl = document.getElementById('countdown');   
                const interval = setInterval(() => { 
                    if (countdown > 1) {
                        countdown--;
                        countdownEl.innerText = countdown;
                    } else {
                        clearInterval(interval);
                        window.location.href = '/';
                    }
                }, 1000); 
            </script>
            
        `); // Handle unauthorized access
    }

    // Set flags in res.locals for EJS template
    res.locals.isAdmin = isAdmin || false;
    res.locals.isWriter = isWriter || false;

    next();  // Call the next middleware
}

module.exports = { isAuthenticated, isAdminOrWriter };