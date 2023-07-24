import { PrismaClient, User } from '@prisma/client';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const fakerUser = (): any => ({
  username: faker.internet.userName(),
});

async function main() {
  const fakerRounds = 20;
  dotenv.config();
  console.log('Seeding...');
  /// --------- Users ---------------
  for (let i = 0; i < fakerRounds; i++) {
    await prisma.user.create({ data: fakerUser() });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
