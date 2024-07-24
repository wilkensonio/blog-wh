 
import Subscriber from '../models/subscribe.js'; 
import { v4 as uuidv4 } from 'uuid'; 

export const subscribe = async (req, res) => {

    try {
        const email = req.body.email.trim().toLowerCase();
        const deviceId = req.body.deviceId || uuidv4();
        
        if (!email) {
            return;
        }

        let subscriber = await Subscriber.findOne({ deviceId});
        if (subscriber)
            return res.redirect('/articles');
        
        subscriber = await Subscriber.findOne({email}); 
        
        if (subscriber)
            return res.redirect('/articles');
        
        const subscriberToken = uuidv4(); 
        subscriber = new Subscriber({ email, verificationToken: subscriberToken, deviceId });
        await subscriber.save(); 

        res.cookie('deviceId', deviceId, { httpsOnly: true, });
        return res.redirect('/articles');
             
        
    } catch (error) {
        if (error.code === 11000)  
            return res.redirect('/articles');
        else
            return res.status(500).json({ message: error.message });
    }
}

 
 
 

 