import { Module } from '@nestjs/common';
import { CommunityModule } from './community/community.module.js';

import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';

import {
  MongooseModule,
} from '@nestjs/mongoose';

import {
  AppController,
} from './app.controller.js';

import {
  AppService,
} from './app.service.js';

import {
  AuthModule,
} from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => ({
        uri: configService.getOrThrow<string>(
          'MONGODB_URI',
        ),

        dbName: 'fit-flow',

        family: 4,

        serverSelectionTimeoutMS: 10000,
      }),
    }),

    AuthModule,
    CommunityModule,
  ],

  controllers: [
    AppController,
  ],

  providers: [
    AppService,
  ],
})
export class AppModule { }
