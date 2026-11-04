import { Request, Response, NextFunction } from 'express';
import { paymentService } from './payment.service.js';

export class PaymentController {
  async processMockPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await paymentService.processMockPayment(req.body);
      res.status(200).json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payment = await paymentService.getPaymentStatus(req.params.id);
      res.status(200).json({
        success: true,
        data: payment,
        message: 'Payment status retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const paymentController = new PaymentController();

