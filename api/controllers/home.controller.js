const sendEmail = require('../utils/mailer.js');
const Subscriber = require('../models/subscribe.js'); 
const { v4: uuidv4 } = require('uuid'); 

const renderHomePage = (req, res) => {
    const isAdmin = req.user && req.user.isAdmin === true;
    const isWriter = req.user && req.user.isWriter === true;
    res.render('home/index', { isAdmin, isWriter });
};

const subscribe = async (req, res) => {

    try {
        const email = req.body.email.trim().toLowerCase();
        const deviceId = req.body.deviceId || uuidv4();
        
        if (!email) {
            return;
        }

        let subscriber = await Subscriber.findOne({ deviceId});
        if (subscriber)
            return res.redirect('/posts');
        
        subscriber = await Subscriber.findOne({email});  
        if (subscriber) 
            return res.redirect('/posts');
        
        const subscriberToken = uuidv4(); 
        subscriber = new Subscriber({ email, verificationToken: subscriberToken, deviceId });
        await subscriber.save(); 

        const subject = "Welcome to our blog!";
        const text = "Thank you for subscribing to our blog. Please click the link below to verify your email address.";
        const verificationLink = `${process.env.BASE_URL}/subscribe/verify/${subscriberToken}`;
        await sendEmail(email, subject, `${text} ${verificationLink}`);

        res.cookie('deviceId', deviceId, { httpsOnly: true, });
        return res.redirect('/posts');
             
        
    } catch (error) {
        if (error.code === 11000)  
            return res.redirect('/posts');
        else{
          res.redirect('/posts');
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = {subscribe, renderHomePage};

 
 
 
 

 