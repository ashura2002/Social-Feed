import { User } from 'src/modules/users/entity/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ type: 'int' })
  age: number;

  @Column()
  avatar?: string;

  @Column({ type: 'int' })
  phonenumber: number;

  @Column()
  address: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
