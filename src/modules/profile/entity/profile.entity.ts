import { User } from 'src/modules/users/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ nullable: true })
  avatar?: string;

  @Column()
  phonenumber: string;

  @Column()
  address: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;
}
