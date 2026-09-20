import { Request, Response, NextFunction } from 'express';
import { HOUSES, REGIONS, PROFESSIONS, TRAITS } from '../data/gameData';

export const getHouses = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: { houses: HOUSES },
    });
  } catch (error) {
    next(error);
  }
};

export const getRegions = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: { regions: REGIONS },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfessions = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: { professions: PROFESSIONS },
    });
  } catch (error) {
    next(error);
  }
};

export const getTraits = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: { traits: TRAITS },
    });
  } catch (error) {
    next(error);
  }
};
