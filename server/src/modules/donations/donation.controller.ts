import { Request, Response, NextFunction } from 'express';
import { donationService } from './donation.service.js';

export class DonationController {
  async createDonation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const donation = await donationService.createDonation(req.body, req.user?.id);
      res.status(201).json({
        success: true,
        data: donation,
        message: 'Donation order initiated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getDonationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const donation = await donationService.getDonationById(
        req.params.id,
        req.user?.id,
        req.user?.role
      );
      res.status(200).json({
        success: true,
        data: donation,
        message: 'Donation details retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyDonations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const donations = await donationService.getDonationsForCurrentUser(req.user!.id);
      res.status(200).json({
        success: true,
        data: donations,
        message: 'Donor history retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async listAllAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, status, campaignId, page, limit } = req.query as any;
      const result = await donationService.listAllDonationsAdmin({
        search,
        status,
        campaignId,
        page: Math.max(1, parseInt(page, 10) || 1),
        limit: Math.min(50, Math.max(1, parseInt(limit, 10) || 10)),
      });
      res.status(200).json({
        success: true,
        data: result,
        message: 'Admin donations list retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const donationController = new DonationController();
