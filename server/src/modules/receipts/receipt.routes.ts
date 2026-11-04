import { Router } from 'express';
import { receiptController } from './receipt.controller.js';
import { optionalAuthenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/:id', optionalAuthenticate, receiptController.getById);
router.get('/:id/download', optionalAuthenticate, receiptController.downloadPdf);

export default router;
