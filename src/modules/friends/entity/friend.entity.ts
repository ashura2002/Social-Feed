import { FriendStatus } from 'src/common/Enums/friend-status-enum';
import { User } from 'src/modules/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentFriendRequests)
  requester: User; // who sent request

  @ManyToOne(() => User, (user) => user.receivedFriendRequests)
  receiver: User; // who receives request

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: FriendStatus,
    default: FriendStatus.PENDING,
  })
  status: FriendStatus;
}
