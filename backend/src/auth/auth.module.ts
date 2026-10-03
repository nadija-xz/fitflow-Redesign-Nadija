import { Module } from '@nestjs/common';

import {
    MongooseModule,
} from '@nestjs/mongoose';

import {
    JwtModule,
} from '@nestjs/jwt';

import {
    ConfigModule,
    ConfigService,
} from '@nestjs/config';

import {
    User,
    UserSchema,
} from '../users/user.schema.js';

import {
    AuthController,
} from './auth.controller.js';

import {
    AuthService,
} from './auth.service.js';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),

        JwtModule.registerAsync({
            imports: [ConfigModule],

            inject: [ConfigService],

            useFactory: (
                configService: ConfigService,
            ) => ({
                secret:
                    configService.getOrThrow<string>(
                        'JWT_SECRET',
                    ),

                signOptions: {
                    expiresIn: 60 * 60 * 24 * 7,
                },
            }),
        }),
    ],

    controllers: [
        AuthController,
    ],

    providers: [
        AuthService,
    ],
    exports: [AuthService],
})
export class AuthModule { }
