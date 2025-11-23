import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Setup test database
  await prisma.$connect();
});

afterAll(async () => {
  // Cleanup test database
  await prisma.$disconnect();
});

afterEach(async () => {
  // Reset database between tests
  const models = Object.keys(prisma).filter(key => !key.startsWith('_'));
  
  for (const model of models) {
    await (prisma as any)[model].deleteMany();
  }
});
