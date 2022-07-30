import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import type { MercuriusDriverConfig } from '@nestjs/mercurius';
import { MercuriusDriver } from '@nestjs/mercurius';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: true,
      cache: true,
      graphiql: true,
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [PrismaService],
  controllers: [AppController],
})
export class AppModule {}
