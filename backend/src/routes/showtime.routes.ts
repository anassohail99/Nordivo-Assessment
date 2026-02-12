import { Router } from 'express';
import showtimeController from '../controllers/showtime.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', showtimeController.getShowtimes);
router.get('/:id', showtimeController.getShowtimeById);
router.post('/', authenticate, showtimeController.createShowtime);

export default router;
