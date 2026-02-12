import { Router } from 'express';
import reservationController from '../controllers/reservation.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { lockSeatsSchema, confirmReservationSchema, kioskBookingSchema } from '../utils/validators';

const router = Router();

router.post('/lock', authenticate, validate(lockSeatsSchema), reservationController.lockSeats);
router.post('/confirm', authenticate, validate(confirmReservationSchema), reservationController.confirmReservation);
router.get('/user', authenticate, reservationController.getUserReservations);
router.delete('/:id', authenticate, reservationController.cancelReservation);
router.post('/kiosk', validate(kioskBookingSchema), reservationController.kioskBooking);

export default router;
