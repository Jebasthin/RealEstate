import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} users in database. Assigning default mobile numbers...`);
  
  for (const user of users) {
    let mobile = '';
    if (user.email.includes('buyer')) {
      mobile = '+91 98765 43210';
    } else if (user.email.includes('seller')) {
      mobile = '+91 87654 32109';
    } else if (user.email.includes('admin')) {
      mobile = '+91 76543 21098';
    } else {
      mobile = '+91 99999 88888';
    }
    
    await prisma.user.update({
      where: { id: user.id },
      data: { mobile }
    });
    console.log(`User: ${user.email} -> Mobile: ${mobile}`);
  }
  
  console.log('Mobile numbers successfully initialized!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
