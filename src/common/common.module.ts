import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CommonService } from './common.service';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.dev'],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
