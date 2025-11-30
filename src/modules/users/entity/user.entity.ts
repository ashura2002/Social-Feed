import { Roles } from 'src/common/Enums/roles.enums';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { UserStatus } from 'src/common/Enums/user-status.enum';
import { Profile } from 'src/modules/profile/entity/profile.entity';
import { Posts } from 'src/modules/posts/entity/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.User })
  role: Roles;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.InActive })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  @OneToOne(() => Profile, (profile) => profile.user, { nullable: true })
  profile: Profile;

  @OneToMany(() => Posts, (post) => post.user)
  posts: Posts[];
}
