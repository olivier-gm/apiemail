import {
    Router
} from 'express';
import {
    sendEmail,
    getStats
} from '../controllers/emailController.js';

const router = Router();

router.post('/send-email', sendEmail);
router.get('/stats', getStats);

export default router;