import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class ChatGptService {
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly apiKey = process.env.OPENAI_API_KEY;

  // CSV 파일을 읽어 데이터 변환
  async parseCsv(filePath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const results: string[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(JSON.stringify(data)))
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });
  }

  // ChatGPT API 호출
  async askChatGPT(question: string, csvData: string[]): Promise<string> {
    const prompt = `다음 CSV 데이터를 참고하여 질문에 답변해 주세요:\n${csvData.join('\n')}\n\n질문: ${question}`;

    const response = await axios.post(
      this.apiUrl,
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.choices[0].message.content;
  }
}
