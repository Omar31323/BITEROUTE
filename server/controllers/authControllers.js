//@ts-nocheck
import User from '../models/User.js'

export const getSignupPage = (req, res) => {
    const formData = req.session.formData || {};
    req.session.formData = null;
    res.render('Signup', { formData });
};

export const SignUp = async (req, res, next) => {
    const user = new User();
    user.set(req.body);
    try {
        await user.save();
    }
    catch (error) {
        let errorMessage = error.message;
        if (error.code === 11000)
            errorMessage = 'Email is already in use.';
        req.session.formData = req.body;
        req.session.formData.errorMessage = errorMessage;
        return res.status(400).json({ success: false, message: errorMessage })
    }
    
    return res.json({ success: true });
};

export const getLoginPage = (req, res) => {
    const formData = req.session.formData || {};
    req.session.formData = null;
    res.render('Login', { formData });
};

export const LogIn = async (req, res) => {
    try {
        let user = await User.userExists(req.body.email, req.body.password);
        if (user) {
            req.session.user = { id: user._id, firstname: user.firstname, email: user.email };
            req.session.isAuthenticated = true;
            req.session.isAdmin = user.isAdmin;
            req.session.save(() => {
                console.log(req.session);
              
                return res.json({ success: true, user: req.session.user, isAdmin: req.session.isAdmin })
            });
        }

    } catch (error) {
        let errorMessage = error.message;
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
export const LogOut = (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
}

export const persistUser = (req,res) => {
    if(req.session.user){
        res.json({user:req.session.user,isAdmin:req.session.isAdmin});
    }
    else{
        res.json(null);
    }
}