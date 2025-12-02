import { ReactionType } from 'src/common/Enums/reactions.enums';
import { Posts } from 'src/modules/posts/entity/post.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ReactionType, nullable: true })
  reaction: ReactionType;

  @ManyToOne(() => Posts, (post) => post.reactions)
  post: Posts;
}
