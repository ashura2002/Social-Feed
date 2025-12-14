import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entity/user.entity';
import { Roles } from 'src/common/Enums/roles.enums';

export async function seedUsers(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);

  const existingUser = await userRepo.findOne({
    where: { email: 'admin1@gmail.com' },
  });

  if (existingUser) {
    console.log('Seed user already exists');
    return;
  }

  const user = userRepo.create({
    username: 'admin1',
    email: 'admin1@gmail.com',
    password: await bcrypt.hash('admin123', 10),
    role: Roles.Admin,
  });

  await userRepo.save(user);
  console.log('Seed user created');
}
