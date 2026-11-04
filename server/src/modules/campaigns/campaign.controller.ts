import { Request, Response, NextFunction } from 'express';
import { campaignService } from './campaign.service.js';

export class CampaignController {
  async listPublic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaigns = await campaignService.listPublicCampaigns();
      res.status(200).json({
        success: true,
        data: campaigns,
        message: 'Campaigns retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaign = await campaignService.getCampaignBySlug(req.params.slug);
      res.status(200).json({
        success: true,
        data: campaign,
        message: 'Campaign details retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async listAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaigns = await campaignService.listAdminCampaigns();
      res.status(200).json({
        success: true,
        data: campaigns,
        message: 'Admin campaigns retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaign = await campaignService.createCampaign(req.body, req.user!.id);
      res.status(201).json({
        success: true,
        data: campaign,
        message: 'Campaign created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaign = await campaignService.updateCampaign(req.params.id, req.body, req.user!.id);
      res.status(200).json({
        success: true,
        data: campaign,
        message: 'Campaign updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const campaignController = new CampaignController();
