import { Router } from 'express';
import verifyJwt from '../middleware/auth.middleware.js';
import { subscribe } from '../controllers/subscription.controller.js';


const router = Router();
router.route("/subscribe").post(verifyJwt, subscribe);





export default router;