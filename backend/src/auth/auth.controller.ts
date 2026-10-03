import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Patch,
    Headers,
} from '@nestjs/common';

import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Patch('onboarding')
    completeOnboarding(
        @Headers('authorization') authorization: string | undefined,
        @Body() body: unknown,
    ) {
        return this.authService.completeOnboarding(authorization, body);
    }

    @Post('register')
    register(
        @Body()
        body: {
            email: string;
            password: string;
        },
    ) {
        return this.authService.register(
            body.email,
            body.password,
        );
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(
        @Body()
        body: {
            email: string;
            password: string;
        },
    ) {
        return this.authService.login(
            body.email,
            body.password,
        );
    }

    @Post('google')
    @HttpCode(HttpStatus.OK)
    googleLogin(
        @Body()
        body: {
            idToken: string;
        },
    ) {
        return this.authService.googleLogin(
            body.idToken,
        );
    }
}
