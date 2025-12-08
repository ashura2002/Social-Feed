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
import { Reaction } from 'src/modules/reactions/entity/reaction.entity';
import { Notification } from 'src/modules/notifications/entity/notification.entity';
import { Friend } from 'src/modules/friends/entity/friend.entity';

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

  @OneToOne(() => Profile, (profile) => profile.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  profile: Profile;

  @OneToMany(() => Posts, (post) => post.user, { onDelete: 'CASCADE' })
  posts: Posts[];

  @OneToMany(() => Reaction, (react) => react.user, { onDelete: 'CASCADE' })
  reactions: Reaction[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    onDelete: 'CASCADE',
  })
  notifications: Notification[];

  @OneToMany(() => Friend, (friend) => friend.requester)
  sentFriendRequests: Friend[];

  @OneToMany(() => Friend, (friend) => friend.receiver)
  receivedFriendRequests: Friend[];
}
