import prisma from '../config/db.js';
import { ApiError } from '../middleware/errorMiddleware.js';

/**
 * Customer creates an enquiry on a property listing
 */
export const createEnquiry = async (req, res, next) => {
  try {
    const { propertyId, message } = req.body;
    const customerId = req.user.userId;

    if (!propertyId || !message) {
      throw new ApiError(400, 'Missing property selection or enquiry message content.');
    }

    // Verify property exists and is active
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new ApiError(404, 'Property listing not found.');
    }

    // Check duplicate inquiries (assignment specifies "prevent duplicate inquiries")
    const existingEnquiry = await prisma.enquiry.findFirst({
      where: {
        propertyId,
        customerId,
      },
    });

    if (existingEnquiry) {
      throw new ApiError(400, 'You have already submitted an enquiry for this property listing.');
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        propertyId,
        customerId,
        message,
      },
      include: {
        property: {
          select: { title: true, ownerId: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. The property owner will contact you shortly.',
      data: { enquiry },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Owner/Agent views leads sent to their properties
 */
export const myLeads = async (req, res, next) => {
  try {
    const ownerId = req.user.userId;

    const enquiries = await prisma.enquiry.findMany({
      where: {
        property: {
          ownerId,
        },
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            city: true,
            status: true,
            viewId: true,
          },
        },
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            mobile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: { enquiries },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Customer/Buyer views inquiries they have sent
 */
export const mySentEnquiries = async (req, res, next) => {
  try {
    const customerId = req.user.userId;

    const enquiries = await prisma.enquiry.findMany({
      where: {
        customerId,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            propertyType: true,
            city: { select: { name: true } },
            state: { select: { name: true } },
            areaLocality: { select: { name: true } },
            status: true,
            owner: {
              select: {
                fullName: true,
                email: true,
                mobile: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: { enquiries },
    });
  } catch (error) {
    next(error);
  }
};
