import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatGptService } from './chatgpt.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Multer } from 'multer';

@Controller('chatgpt')
export class ChatGptController {
  constructor(private readonly chatGptService: ChatGptService) {}

  @Post('ask')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, callback) => {
          const fileExtName = extname(file.originalname);
          callback(null, `${Date.now()}${fileExtName}`);
        },
      }),
    }),
  )
  async askChatGpt(
    @UploadedFile() file: Express.Multer.File,
    @Body('question') question: string,
  ) {
    if (!file) {
      return { message: 'CSV 파일이 필요합니다.' };
    }

    const csvData = await this.chatGptService.parseCsv(file.path);
    const response = await this.chatGptService.askChatGPT(question, csvData);

    return { answer: response };
  }
}
