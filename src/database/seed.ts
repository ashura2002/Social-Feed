import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { seedUsers } from './seeded/user.seed';


async function runSeed() {
  await AppDataSource.initialize();
  await seedUsers(AppDataSource);
  await AppDataSource.destroy();
}

runSeed()
  .then(() => {
    console.log('Admin seed completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Admin seed failed', err);
    process.exit(1);
  });
