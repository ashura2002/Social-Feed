import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';

@Module({
  imports: [UsersModule, PostsModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
