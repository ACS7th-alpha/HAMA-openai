import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatGptModule } from './chatgpt/chatgpt.module';

@Module({
  imports: [ConfigModule.forRoot({}), ChatGptModule],
})
export class AppModule {}
