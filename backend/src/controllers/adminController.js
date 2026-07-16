import prisma from '../config/db.js';
import { ApiError } from '../middleware/errorMiddleware.js';

/**
 * Admin lists all pending property listings awaiting moderation
 */
export const listPendingProperties = async (req, res, next) => {
  try {
    const properties = await prisma.property.findMany({
      where: { status: 'PENDING' },
      include: {
        images: true,
        state: true,
        city: true,
        areaLocality: true,
        amenities: {
          include: { amenity: true },
        },
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
            mobile: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // First-in, first-out review queue
      },
    });

    res.status(200).json({
      success: true,
      data: { properties },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin approves listing -> marks as APPROVED (which makes it visible to public search)
 */
export const approveProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new ApiError(404, 'Property listing not found.');
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    res.status(200).json({
      success: true,
      message: 'Property listing approved successfully and is now active.',
      data: { property: updatedProperty },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin rejects listing -> marks as ARCHIVED (removes from audit queue, hides from public)
 */
export const rejectProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new ApiError(404, 'Property listing not found.');
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    res.status(200).json({
      success: true,
      message: 'Property listing rejected and archived.',
      data: { property: updatedProperty },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all users in the system (Admin only)
 */
export const listUsers = async (req, res, next) => {
  try {
    const pageVal = parseInt(req.query.page) || 1;
    const limitVal = parseInt(req.query.limit) || 10;
    const searchVal = req.query.search || '';
    const roleVal = req.query.role || '';

    const skipVal = (pageVal - 1) * limitVal;

    const where = {};
    if (searchVal) {
      where.OR = [
        { fullName: { contains: searchVal, mode: 'insensitive' } },
        { email: { contains: searchVal, mode: 'insensitive' } },
        { mobile: { contains: searchVal, mode: 'insensitive' } },
      ];
    }
    if (roleVal) {
      where.role = roleVal;
    }

    const total = await prisma.user.count({ where });
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        fullName: true,
        mobile: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: skipVal,
      take: limitVal,
    });

    res.status(200).json({
      success: true,
      data: { users },
      pagination: {
        total,
        page: pageVal,
        limit: limitVal,
        totalPages: Math.ceil(total / limitVal),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user details (Admin only)
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, mobile, role } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new ApiError(400, 'Email already in use.');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        fullName: fullName !== undefined ? fullName : user.fullName,
        email: email !== undefined ? email : user.email,
        mobile: mobile !== undefined ? mobile : user.mobile,
        role: role !== undefined ? role : user.role,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        mobile: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'User details updated successfully.',
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user.userId) {
      throw new ApiError(400, 'You cannot delete your own admin account.');
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    await prisma.user.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new State (Admin only)
 */
export const createState = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new ApiError(400, 'State name is required.');
    }

    const existingState = await prisma.state.findUnique({ where: { name } });
    if (existingState) {
      throw new ApiError(400, 'State with this name already exists.');
    }

    const state = await prisma.state.create({
      data: { name },
    });

    res.status(201).json({
      success: true,
      message: 'State created successfully.',
      data: { state },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete State (Admin only)
 */
export const deleteState = async (req, res, next) => {
  try {
    const { id } = req.params;

    const state = await prisma.state.findUnique({ where: { id } });
    if (!state) {
      throw new ApiError(404, 'State not found.');
    }

    await prisma.state.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'State deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new City (Admin only)
 */
export const createCity = async (req, res, next) => {
  try {
    const { name, stateId } = req.body;
    if (!name || !stateId) {
      throw new ApiError(400, 'City name and state ID are required.');
    }

    const state = await prisma.state.findUnique({ where: { id: stateId } });
    if (!state) {
      throw new ApiError(404, 'State not found.');
    }

    const existingCity = await prisma.city.findFirst({
      where: { name, stateId },
    });
    if (existingCity) {
      throw new ApiError(400, 'City with this name already exists in this state.');
    }

    const city = await prisma.city.create({
      data: { name, stateId },
    });

    res.status(201).json({
      success: true,
      message: 'City created successfully.',
      data: { city },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete City (Admin only)
 */
export const deleteCity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const city = await prisma.city.findUnique({ where: { id } });
    if (!city) {
      throw new ApiError(404, 'City not found.');
    }

    await prisma.city.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'City deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new Area (Admin only)
 */
export const createArea = async (req, res, next) => {
  try {
    const { name, cityId } = req.body;
    if (!name || !cityId) {
      throw new ApiError(400, 'Area name and city ID are required.');
    }

    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) {
      throw new ApiError(404, 'City not found.');
    }

    const existingArea = await prisma.area.findFirst({
      where: { name, cityId },
    });
    if (existingArea) {
      throw new ApiError(400, 'Area with this name already exists in this city.');
    }

    const area = await prisma.area.create({
      data: { name, cityId },
    });

    res.status(201).json({
      success: true,
      message: 'Area created successfully.',
      data: { area },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Area (Admin only)
 */
export const deleteArea = async (req, res, next) => {
  try {
    const { id } = req.params;

    const area = await prisma.area.findUnique({ where: { id } });
    if (!area) {
      throw new ApiError(404, 'Area not found.');
    }

    await prisma.area.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Area deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all Cities with State info (Admin only)
 */
export const listAllCities = async (req, res, next) => {
  try {
    const pageVal = parseInt(req.query.page) || 1;
    const limitVal = parseInt(req.query.limit) || 10;
    const searchVal = req.query.search || '';

    const skipVal = (pageVal - 1) * limitVal;

    const where = {};
    if (searchVal) {
      where.OR = [
        { name: { contains: searchVal, mode: 'insensitive' } },
        { state: { name: { contains: searchVal, mode: 'insensitive' } } },
      ];
    }

    const total = await prisma.city.count({ where });
    const cities = await prisma.city.findMany({
      where,
      include: {
        state: true,
      },
      orderBy: {
        name: 'asc',
      },
      skip: skipVal,
      take: limitVal,
    });

    res.status(200).json({
      success: true,
      data: { cities },
      pagination: {
        total,
        page: pageVal,
        limit: limitVal,
        totalPages: Math.ceil(total / limitVal),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all Areas with City and State info (Admin only)
 */
export const listAllAreas = async (req, res, next) => {
  try {
    const pageVal = parseInt(req.query.page) || 1;
    const limitVal = parseInt(req.query.limit) || 10;
    const searchVal = req.query.search || '';

    const skipVal = (pageVal - 1) * limitVal;

    const where = {};
    if (searchVal) {
      where.OR = [
        { name: { contains: searchVal, mode: 'insensitive' } },
        { city: { name: { contains: searchVal, mode: 'insensitive' } } },
        { city: { state: { name: { contains: searchVal, mode: 'insensitive' } } } },
      ];
    }

    const total = await prisma.area.count({ where });
    const areas = await prisma.area.findMany({
      where,
      include: {
        city: {
          include: {
            state: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
      skip: skipVal,
      take: limitVal,
    });

    res.status(200).json({
      success: true,
      data: { areas },
      pagination: {
        total,
        page: pageVal,
        limit: limitVal,
        totalPages: Math.ceil(total / limitVal),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all States with pagination (Admin only)
 */
export const listAllStates = async (req, res, next) => {
  try {
    const pageVal = parseInt(req.query.page) || 1;
    const limitVal = parseInt(req.query.limit) || 10;
    const searchVal = req.query.search || '';

    const skipVal = (pageVal - 1) * limitVal;

    const where = {};
    if (searchVal) {
      where.name = { contains: searchVal, mode: 'insensitive' };
    }

    const total = await prisma.state.count({ where });
    const states = await prisma.state.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      skip: skipVal,
      take: limitVal,
    });

    res.status(200).json({
      success: true,
      data: { states },
      pagination: {
        total,
        page: pageVal,
        limit: limitVal,
        totalPages: Math.ceil(total / limitVal),
      },
    });
  } catch (error) {
    next(error);
  }
};
