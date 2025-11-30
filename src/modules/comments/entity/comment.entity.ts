import { Posts } from 'src/modules/posts/entity/post.entity';
import { User } from 'src/modules/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string; // the actual comment text

  @ManyToOne(() => Posts, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Posts;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User; // who commented

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
