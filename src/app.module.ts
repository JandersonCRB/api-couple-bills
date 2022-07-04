import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillsModule } from './bills/bills.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    BillsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.development.local'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // migrations: ['src/migration/*{.js.ts}'],
      synchronize: true,
      // cli: {
      //   migrationsDir: 'src/migration',
      // },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
