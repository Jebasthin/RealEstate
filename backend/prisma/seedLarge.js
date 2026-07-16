import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching users and locations...');
  // Find or create default seller
  let seller = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'seller123@gmail.com' },
        { role: 'SELLER' }
      ]
    }
  });
  if (!seller) {
    seller = await prisma.user.create({
      data: {
        email: 'seller@example.com',
        fullName: 'Jose Seller',
        passwordHash: '$2b$10$g1kXU69WlE5MebNsh.kC3.q6/zY1QzT5yvXQWp4P.76b7L8hR/UqC', // password
        role: 'SELLER',
      }
    });
  }

  // Find or create default buyer
  let buyer = await prisma.user.findFirst({ where: { role: 'BUYER' } });
  if (!buyer) {
    buyer = await prisma.user.create({
      data: {
        email: 'buyer@example.com',
        fullName: 'Jose Buyer',
        passwordHash: '$2b$10$g1kXU69WlE5MebNsh.kC3.q6/zY1QzT5yvXQWp4P.76b7L8hR/UqC', // password
        role: 'BUYER',
      }
    });
  }

  // Query location structures
  const states = await prisma.state.findMany({
    include: {
      cities: {
        include: {
          areas: true
        }
      }
    }
  });

  if (states.length === 0) {
    console.error('No states found. Please run the default seed first.');
    return;
  }

  // Collect all valid combinations of state, city, area
  const locationPool = [];
  for (const state of states) {
    for (const city of state.cities) {
      for (const area of city.areas) {
        locationPool.push({
          stateId: state.id,
          cityId: city.id,
          areaId: area.id,
        });
      }
    }
  }

  if (locationPool.length === 0) {
    console.error('No valid state-city-area hierarchy. Please seed locations first.');
    return;
  }

  console.log(`Location pool initialized with ${locationPool.length} regions.`);
  console.log('Generating 50,000 properties in memory...');

  const propertyTypes = ['HOUSE', 'APARTMENT', 'VILLA', 'LAND', 'COMMERCIAL'];
  const titles = [
    'Luxury Penthouse with View',
    'Modern Family Apartment',
    'Spacious Premium Villa',
    'Commercial Office Space',
    'Residential Plot for House',
    'Charming Cozy Row House',
    'Elegant Studio Suite',
    'Traditional Heritage Villa',
    'Industrial Warehouse Plot',
    'High-Rise Corporate Suite'
  ];

  const totalToSeed = 50000;
  const chunkSize = 5000;
  
  // Base image URLs list to cycle through
  const imageUrls = [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  ];

  for (let i = 0; i < totalToSeed; i += chunkSize) {
    const propertiesChunk = [];
    const currentEnd = Math.min(i + chunkSize, totalToSeed);
    
    for (let j = i; j < currentEnd; j++) {
      const loc = locationPool[j % locationPool.length];
      const propType = propertyTypes[j % propertyTypes.length];
      const titlePrefix = titles[j % titles.length];
      const price = Math.floor(15 + (j % 985)) * 100000; // Rs. 15 Lakhs to Rs. 10 Crores
      const areaVal = Math.floor(500 + (j % 4500)); // 500 to 5000 sq ft
      const beds = propType === 'LAND' || propType === 'COMMERCIAL' ? 0 : Math.floor(1 + (j % 5));
      const baths = propType === 'LAND' || propType === 'COMMERCIAL' ? 0 : Math.floor(1 + (j % 4));
      
      propertiesChunk.push({
        title: titlePrefix,
        description: `Premium ${propType.toLowerCase()} located in prime area with modern styling, high amenities, 24/7 security, and close proximity to public transit and shopping centers. Ideal investment or residency choice.`,
        price: parseFloat(price),
        area: parseFloat(areaVal),
        bedrooms: beds,
        bathrooms: baths,
        parking: j % 2 === 0,
        status: 'APPROVED', // Pre-approved so buyers see them immediately!
        propertyType: propType,
        stateId: loc.stateId,
        cityId: loc.cityId,
        areaId: loc.areaId,
        ownerId: seller.id,
        viewId: j + 1,
      });
    }

    // Insert chunk of properties
    await prisma.property.createMany({
      data: propertiesChunk
    });

    console.log(`Inserted properties chunk ${i} to ${currentEnd}...`);
  }

  // To make the images show up, let's link images to properties!
  // Query all property IDs
  console.log('Linking primary images to seeded properties...');
  const allProperties = await prisma.property.findMany({
    select: { id: true },
    where: {
      ownerId: seller.id,
      viewId: {
        not: null
      }
    }
  });

  console.log(`Found ${allProperties.length} seeded properties. Seeding image links...`);

  // We can bulk insert images in chunks too
  for (let i = 0; i < allProperties.length; i += chunkSize) {
    const imagesChunk = [];
    const currentEnd = Math.min(i + chunkSize, allProperties.length);

    for (let j = i; j < currentEnd; j++) {
      const p = allProperties[j];
      const imageUrl = imageUrls[j % imageUrls.length];
      imagesChunk.push({
        propertyId: p.id,
        url: imageUrl,
        isPrimary: true,
      });
    }

    await prisma.propertyImage.createMany({
      data: imagesChunk
    });
    console.log(`Inserted images chunk ${i} to ${currentEnd}...`);
  }

  console.log('Successfully completed seeding 50,000 properties!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
