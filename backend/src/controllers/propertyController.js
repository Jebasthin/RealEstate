import prisma from '../config/db.js';
import { ApiError } from '../middleware/errorMiddleware.js';

/**
 * Owner/Agent creates a new property listing (defaults to PENDING status)
 */
export const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      area,
      bedrooms,
      bathrooms,
      parking,
      propertyType,
      stateId,
      cityId,
      areaId,
      amenityIds, // Array of Amenity IDs
      images,      // Array of image base64 strings or URLs
    } = req.body;

    const ownerId = req.user.userId;

    // Basic fields validation
    if (!title || !price || !area || !propertyType || !stateId || !cityId || !areaId) {
      throw new ApiError(400, 'Missing required listing information fields.');
    }

    // Convert values
    const parsedPrice = parseFloat(price);
    const parsedArea = parseFloat(area);
    const parsedBedrooms = parseInt(bedrooms) || 0;
    const parsedBathrooms = parseInt(bathrooms) || 0;
    const parsedParking = !!parking;

    // Calculate next viewId for this owner
    const latestProperty = await prisma.property.findFirst({
      where: { ownerId },
      orderBy: { createdAt: 'desc' }
    });
    let nextViewId = 1;
    if (latestProperty && latestProperty.viewId) {
      nextViewId = latestProperty.viewId + 1;
    } else {
      const count = await prisma.property.count({ where: { ownerId } });
      nextViewId = count + 1;
    }

    // Create property transaction
    const property = await prisma.property.create({
      data: {
        title,
        description: description || '',
        price: parsedPrice,
        area: parsedArea,
        bedrooms: parsedBedrooms,
        bathrooms: parsedBathrooms,
        parking: parsedParking,
        propertyType,
        stateId,
        cityId,
        areaId,
        ownerId,
        status: 'PENDING', // Awaiting Admin Approval
        viewId: nextViewId,
        images: {
          create: (images || []).map((imgUrl, index) => ({
            url: imgUrl,
            isPrimary: index === 0, // Mark first image as primary
          })),
        },
        amenities: {
          create: (amenityIds || []).map((aId) => ({
            amenityId: aId,
          })),
        },
      },
      include: {
        images: true,
        state: true,
        city: true,
        areaLocality: true,
        amenities: {
          include: { amenity: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Property listing created successfully and is pending admin approval.',
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public search/list of approved properties
 */
export const listProperties = async (req, res, next) => {
  try {
    const { city, stateId, cityId, areaId, propertyType, bedrooms, minPrice, maxPrice, sortBy, order, page, limit } = req.query;

    const whereClause = {
      status: 'APPROVED', // Public search returns approved listings only
    };

    // Filter by exact master relations if provided
    if (stateId) whereClause.stateId = stateId;
    if (cityId) whereClause.cityId = cityId;
    if (areaId) whereClause.areaId = areaId;

    // Filter by city name search (text based)
    if (city) {
      whereClause.city = {
        name: {
          contains: city.trim(),
          mode: 'insensitive',
        },
      };
    }

    // Filter by type
    if (propertyType) {
      whereClause.propertyType = propertyType;
    }

    // Filter by bedrooms
    if (bedrooms) {
      whereClause.bedrooms = parseInt(bedrooms);
    }

    // Filter by budget bounds
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
    }

    // Sorting configs
    const orderColumn = sortBy || 'createdAt';
    const orderDirection = order === 'asc' ? 'asc' : 'desc';

    // Pagination configs
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;
    const skip = (parsedPage - 1) * parsedLimit;

    // Get total count matching criteria
    const totalCount = await prisma.property.count({
      where: whereClause,
    });

    const properties = await prisma.property.findMany({
      where: whereClause,
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
        [orderColumn]: orderDirection,
      },
      skip: skip,
      take: parsedLimit,
    });

    res.status(200).json({
      success: true,
      count: properties.length,
      pagination: {
        total: totalCount,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(totalCount / parsedLimit),
      },
      data: { properties },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticated owner lists their own properties (regardless of status)
 */
export const myListings = async (req, res, next) => {
  try {
    const ownerId = req.user.userId;
    const { page, limit, title, viewId } = req.query;

    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;
    const skip = (parsedPage - 1) * parsedLimit;

    const whereClause = { ownerId };

    if (title) {
      whereClause.title = {
        contains: title.trim(),
        mode: 'insensitive',
      };
    }

    if (viewId) {
      const cleanViewId = parseInt(viewId.replace('#', '').trim());
      if (!isNaN(cleanViewId)) {
        whereClause.viewId = cleanViewId;
      }
    }

    const totalCount = await prisma.property.count({
      where: whereClause,
    });

    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        images: true,
        state: true,
        city: true,
        areaLocality: true,
        amenities: {
          include: { amenity: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: skip,
      take: parsedLimit,
    });

    res.status(200).json({
      success: true,
      count: properties.length,
      pagination: {
        total: totalCount,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(totalCount / parsedLimit),
      },
      data: { properties },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch detailed property profile
 */
export const getPropertyDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
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
            mobile: true,
          },
        },
      },
    });

    if (!property) {
      throw new ApiError(404, 'Property listing not found.');
    }

    // If listing is not approved, secure it from random public views
    if (property.status !== 'APPROVED') {
      const isOwner = req.user && req.user.userId === property.ownerId;
      const isAdmin = req.user && req.user.role === 'ADMIN';

      if (!isOwner && !isAdmin) {
        throw new ApiError(403, 'Access denied. This listing is pending verification.');
      }
    }

    res.status(200).json({
      success: true,
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Owner updates listing
 */
export const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.userId;

    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new ApiError(404, 'Property listing not found.');
    }

    // Verify ownership
    if (property.ownerId !== ownerId && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'Permission denied. You do not own this listing.');
    }

    const {
      title,
      description,
      price,
      area,
      bedrooms,
      bathrooms,
      parking,
      propertyType,
      stateId,
      cityId,
      areaId,
      amenityIds,
    } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (area !== undefined) updateData.area = parseFloat(area);
    if (bedrooms !== undefined) updateData.bedrooms = parseInt(bedrooms);
    if (bathrooms !== undefined) updateData.bathrooms = parseInt(bathrooms);
    if (parking !== undefined) updateData.parking = !!parking;
    if (propertyType !== undefined) updateData.propertyType = propertyType;
    if (stateId !== undefined) updateData.stateId = stateId;
    if (cityId !== undefined) updateData.cityId = cityId;
    if (areaId !== undefined) updateData.areaId = areaId;

    // Reset status to PENDING if details changed (forces re-verification)
    updateData.status = 'PENDING';

    // Update amenities mapping if provided
    if (amenityIds !== undefined) {
      // Clear existing amenities join
      await prisma.propertyAmenity.deleteMany({
        where: { propertyId: id },
      });

      updateData.amenities = {
        create: amenityIds.map((aId) => ({
          amenityId: aId,
        })),
      };
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        amenities: {
          include: { amenity: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Property listing updated successfully. Awaiting verification check.',
      data: { property: updatedProperty },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Owner deletes listing
 */
export const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.userId;

    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new ApiError(404, 'Property listing not found.');
    }

    // Verify ownership
    if (property.ownerId !== ownerId && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'Permission denied. You do not own this listing.');
    }

    await prisma.property.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Property listing deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Owner updates status (e.g., marks SOLD)
 */
export const updatePropertyStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ownerId = req.user.userId;

    if (!['AVAILABLE', 'BOOKED', 'SOLD', 'ARCHIVED'].includes(status)) {
      throw new ApiError(400, 'Invalid status update value.');
    }

    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new ApiError(404, 'Property listing not found.');
    }

    // Verify ownership
    if (property.ownerId !== ownerId && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'Permission denied. You do not own this listing.');
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      success: true,
      message: `Property status updated to ${status}.`,
      data: { property: updatedProperty },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get list of all seeded amenities
 */
export const listAmenities = async (req, res, next) => {
  try {
    const amenities = await prisma.amenity.findMany({
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: { amenities },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get next incremental View ID for logged in Seller
 */
export const getNextViewId = async (req, res, next) => {
  try {
    const ownerId = req.user.userId;
    const latestProperty = await prisma.property.findFirst({
      where: { ownerId },
      orderBy: { createdAt: 'desc' }
    });
    let nextViewId = 1;
    if (latestProperty && latestProperty.viewId) {
      nextViewId = latestProperty.viewId + 1;
    } else {
      const count = await prisma.property.count({ where: { ownerId } });
      nextViewId = count + 1;
    }
    res.status(200).json({
      success: true,
      nextViewId,
    });
  } catch (error) {
    next(error);
  }
};
