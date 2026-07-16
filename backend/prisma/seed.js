import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding standard amenities...');

  const amenities = [
    'Lift',
    'Car Parking',
    'CCTV',
    'Gym',
    'Swimming Pool'
  ];

  for (const name of amenities) {
    await prisma.amenity.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Amenities seeded.');

  console.log('Start seeding location lookup masters...');

  const states = [
    'Tamil Nadu',
    'Kerala',
    'Karnataka',
    'Andhra Pradesh',
    'Maharashtra'
  ];

  const stateRecords = {};
  for (const name of states) {
    const s = await prisma.state.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    stateRecords[name] = s;
  }
  console.log('States seeded.');

  const tnState = stateRecords['Tamil Nadu'];
  if (!tnState) {
    throw new Error('Tamil Nadu state record not found after seeding!');
  }

  const citiesData = {
    'Madurai': ['Anna Nagar', 'KK Nagar', 'Melur', 'Thirumangalam'],
    'Chennai': ['Velachery', 'Adyar', 'T Nagar', 'Tambaram'],
    'Coimbatore': ['Pollachi', 'Mettupalayam', 'Gandhipuram'],
    'Trichy': ['Srirangam', 'Cantonment', 'Thillai Nagar'],
  };

  for (const [cityName, areasList] of Object.entries(citiesData)) {
    // Seed City linked to Tamil Nadu State
    const city = await prisma.city.upsert({
      where: {
        name_stateId: {
          name: cityName,
          stateId: tnState.id,
        },
      },
      update: {},
      create: {
        name: cityName,
        stateId: tnState.id,
      },
    });

    // Seed Areas linked to this City
    for (const areaName of areasList) {
      await prisma.area.upsert({
        where: {
          name_cityId: {
            name: areaName,
            cityId: city.id,
          },
        },
        update: {},
        create: {
          name: areaName,
          cityId: city.id,
        },
      });
    }
  }

  console.log('Location master database seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
