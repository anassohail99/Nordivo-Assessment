import { Router } from 'express';
import addOnController from '../controllers/addOn.controller';

const router = Router();

router.get('/', addOnController.getAllAddOns.bind(addOnController));
router.get('/:id', addOnController.getAddOnById.bind(addOnController));

export default router;
