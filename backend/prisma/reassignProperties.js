import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sellerEmail = 'seller123@gmail.com';
  
  console.log(`Searching for seller user with email: ${sellerEmail}...`);
  const seller = await prisma.user.findUnique({
    where: { email: sellerEmail }
  });
  
  if (!seller) {
    console.error(`Error: User with email ${sellerEmail} does not exist in the database!`);
    return;
  }
  
  console.log(`Reassigning seeded properties to owner ${seller.fullName} (ID: ${seller.id})...`);
  
  const updated = await prisma.property.updateMany({
    where: {
      title: {
        contains: '#'
      }
    },
    data: {
      ownerId: seller.id
    }
  });
  
  console.log(`Successfully updated ${updated.count} properties!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
