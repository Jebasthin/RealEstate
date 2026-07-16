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
