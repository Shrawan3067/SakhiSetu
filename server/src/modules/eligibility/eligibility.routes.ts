import { Router } from 'express';
import { eligibilityController } from './eligibility.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { eligibilityMatchSchema, callbackRequestSchema } from './eligibility.validator.js';

const router = Router();

router.post('/match', validate(eligibilityMatchSchema), eligibilityController.match);
router.post('/request-callback', validate(callbackRequestSchema), eligibilityController.requestCallback);

export default router;
