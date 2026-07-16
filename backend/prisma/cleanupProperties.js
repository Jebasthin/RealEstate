import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting raw database migration to initialize viewId and clean up titles...');
  
  const startTime = Date.now();
  
  // Execute raw query to assign viewId chronologically per seller and clean up the titles
  const query = `
    WITH RankedProperties AS (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY "ownerId" ORDER BY "createdAt" ASC, "id" ASC) as row_num
      FROM "public"."Property"
    )
    UPDATE "public"."Property" p
    SET "viewId" = rp.row_num,
        "title" = TRIM(SPLIT_PART(p.title, ' #', 1))
    FROM RankedProperties rp
    WHERE p.id = rp.id;
  `;
  
  const count = await prisma.$executeRawUnsafe(query);
  
  console.log(`Successfully migrated ${count} properties in ${Date.now() - startTime}ms!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
