import prisma from '../config/db.js';

/**
 * Fetch all seeded states
 */
export const getStates = async (req, res, next) => {
  try {
    const states = await prisma.state.findMany({
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: { states },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch cities within a selected state
 */
export const getCitiesByState = async (req, res, next) => {
  try {
    const { stateId } = req.params;

    const cities = await prisma.city.findMany({
      where: { stateId },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: { cities },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch areas within a selected city
 */
export const getAreasByCity = async (req, res, next) => {
  try {
    const { cityId } = req.params;

    const areas = await prisma.area.findMany({
      where: { cityId },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: { areas },
    });
  } catch (error) {
    next(error);
  }
};
