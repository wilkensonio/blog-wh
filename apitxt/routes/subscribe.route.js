import express from 'express';
import {subscribe, renderSubscribePage} from '../controllers/subscribe.controller.js';
import { isAuthenticated } from '../middelware/auth.js';

const router = express.Router();
router.use(isAuthenticated);

router.post('/', subscribe);
router.get('/', renderSubscribePage);
 
export default router;