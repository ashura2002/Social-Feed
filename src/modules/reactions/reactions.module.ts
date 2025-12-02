import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './entity/reaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reaction]),
    JwtModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [ReactionsController],
  providers: [ReactionsService],
})
export class ReactionsModule {}
