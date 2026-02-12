import { Router } from 'express';
import reservationController from '../controllers/reservation.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/:id/availability', authenticate, reservationController.getSeatAvailability);

export default router;
