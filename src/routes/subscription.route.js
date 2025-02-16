import { Router } from 'express';
import verifyJwt from '../middleware/auth.middleware.js';
import { subscribe, unsubscibe, changePlan } from '../controllers/subscription.controller.js';


const router = Router();
router.route("/subscribe").post(verifyJwt, subscribe);
router.route("/unsubscribe").post(verifyJwt, unsubscibe);






export default router;