import { VisibilityOptions } from 'src/common/Enums/visibility.enums';
import { Comment } from 'src/modules/comments/entity/comment.entity';
import { Reaction } from 'src/modules/reactions/entity/reaction.entity';
import { User } from 'src/modules/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column('simple-array', { nullable: true })
  mediaUrls?: string[]; // images or videos

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Column({
    type: 'enum',
    enum: VisibilityOptions,
    default: VisibilityOptions.PUBLIC,
  })
  visibility: VisibilityOptions;

  @Column({ default: false })
  isEdited: boolean;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Reaction, (react) => react.post)
  reactions: Reaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
