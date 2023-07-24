import { PrismaClient, User } from '@prisma/client';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { Role } from '../common/@types/enums/common.enum';

const prisma = new PrismaClient();

async function main() {
  const fakerRounds = 20;
  dotenv.config();
  console.log('Seeding...');
  /// --------- Users ---------------
  for (let i = 0; i < fakerRounds; i++) {
    const random = faker.datatype.boolean();
    await prisma.user.create({ data: fakerUser(random) });
  }
}

const fakerUser = (random: boolean): any => ({
  role: random ? Role.ADMIN : Role.USER,
  email: faker.internet.email(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  deleted_at: random ? undefined : new Date(),
});

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
