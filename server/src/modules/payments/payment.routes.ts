import { Router } from 'express';
import { paymentController } from './payment.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { processPaymentSchema } from '../donations/donation.validator.js';

const router = Router();

router.post('/mock/process', validate(processPaymentSchema), paymentController.processMockPayment);
router.get('/:id/status', paymentController.getPaymentStatus);

export default router;
