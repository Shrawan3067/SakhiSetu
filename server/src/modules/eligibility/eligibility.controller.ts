import { Request, Response, NextFunction } from 'express';
import { eligibilityService } from './eligibility.service.js';

export class EligibilityController {
  async match(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await eligibilityService.evaluateEligibility(req.body);
      res.status(200).json({
        success: true,
        data: result,
        message: 'Eligibility evaluation completed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async requestCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await eligibilityService.createCallbackRequest(req.body);
      res.status(201).json({
        success: true,
        data: result,
        message: 'Callback request registered successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const eligibilityController = new EligibilityController();

