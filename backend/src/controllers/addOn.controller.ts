import { Request, Response } from 'express';
import AddOn from '../models/AddOn';

export class AddOnController {
  async getAllAddOns(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.query;

      const filter: any = { available: true };
      if (category) {
        filter.category = category;
      }

      const addOns = await AddOn.find(filter).sort({ category: 1, price: 1 });

      res.json(addOns);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAddOnById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const addOn = await AddOn.findById(id);
      if (!addOn) {
        res.status(404).json({ error: 'Add-on not found' });
        return;
      }

      res.json(addOn);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new AddOnController();
