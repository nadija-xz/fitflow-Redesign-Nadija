import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Model, isValidObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { OAuth2Client } from 'google-auth-library';

import {
    User,
    UserDocument,
} from '../users/user.schema.js';

@Injectable()
export class AuthService {
    private readonly googleClient = new OAuth2Client();

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        private readonly jwtService: JwtService,

        private readonly configService: ConfigService,
    ) { }

    async authenticatedUser(authorization: string | undefined) {
        const token = authorization?.match(/^Bearer (\S+)$/i)?.[1];
        if (!token) throw new UnauthorizedException('Please sign in again');
        let userId: string;
        try {
            const payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
            if (typeof payload.sub !== 'string' || !isValidObjectId(payload.sub)) throw new Error('Invalid user');
            userId = payload.sub;
        } catch {
            throw new UnauthorizedException('Your session has expired. Please sign in again');
        }
        const user = await this.userModel.findById(userId);
        if (!user) throw new UnauthorizedException('Please sign in again');
        return user;
    }

    async completeOnboarding(authorization: string | undefined, body: unknown) {
        const token = authorization?.match(/^Bearer (\S+)$/i)?.[1];
        if (!token) throw new UnauthorizedException('Please sign in again');
        let userId: string;
        try {
            const payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
            if (typeof payload.sub !== 'string' || !isValidObjectId(payload.sub)) {
                throw new Error('Invalid user');
            }
            userId = payload.sub;
        } catch {
            throw new UnauthorizedException('Your session has expired. Please sign in again');
        }
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            throw new BadRequestException('Please provide your profile details');
        }
        const { age, height, weight, fitnessGoal } = body as Record<string, unknown>;
        if (typeof age !== 'number' || !Number.isInteger(age) || age < 13 || age > 120) {
            throw new BadRequestException('Age must be a whole number between 13 and 120');
        }
        if (typeof height !== 'number' || !Number.isFinite(height) || height < 80 || height > 250) {
            throw new BadRequestException('Height must be between 80 and 250 cm');
        }
        if (typeof weight !== 'number' || !Number.isFinite(weight) || weight < 20 || weight > 350) {
            throw new BadRequestException('Weight must be between 20 and 350 kg');
        }
        if (typeof fitnessGoal !== 'string' || !['lose_weight', 'build_strength', 'improve_endurance'].includes(fitnessGoal)) {
            throw new BadRequestException('Choose a fitness goal');
        }
        const user = await this.userModel.findByIdAndUpdate(userId, {
            $set: { age, height, weight, fitnessGoal, onboardingCompleted: true },
        }, { new: true, runValidators: true });
        if (!user) throw new UnauthorizedException('Please sign in again');
        return this.createAuthResponse(user);
    }

    // ==========================================
    // REGISTER
    // ==========================================

    async register(email: string, password: string) {
        if (!email || !password) {
            throw new BadRequestException(
                'Email and password are required',
            );
        }

        if (password.length < 6) {
            throw new BadRequestException(
                'Password must contain at least 6 characters',
            );
        }

        const normalizedEmail = email
            .trim()
            .toLowerCase();

        const existingUser = await this.userModel.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            throw new ConflictException(
                'An account with this email already exists',
            );
        }

        const passwordHash = await bcrypt.hash(
            password,
            12,
        );

        const user = await this.userModel.create({
            email: normalizedEmail,
            passwordHash,
            providers: ['local'],
            onboardingCompleted: false,
        });

        return this.createAuthResponse(user);
    }

    // ==========================================
    // LOGIN
    // ==========================================

    async login(email: string, password: string) {
        if (!email || !password) {
            throw new BadRequestException(
                'Email and password are required',
            );
        }

        const normalizedEmail = email
            .trim()
            .toLowerCase();

        const user = await this.userModel
            .findOne({
                email: normalizedEmail,
            })
            .select('+passwordHash');

        if (!user || !user.passwordHash) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }

        const passwordMatches =
            await bcrypt.compare(
                password,
                user.passwordHash,
            );

        if (!passwordMatches) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }

        return this.createAuthResponse(user);
    }

    // ==========================================
    // GOOGLE LOGIN / REGISTRATION
    // ==========================================

    async googleLogin(idToken: string) {
        if (!idToken) {
            throw new BadRequestException(
                'Google ID token is required',
            );
        }

        const webClientId =
            this.configService.getOrThrow<string>(
                'GOOGLE_WEB_CLIENT_ID',
            );

        const ticket =
            await this.googleClient.verifyIdToken({
                idToken,
                audience: webClientId,
            });

        const payload = ticket.getPayload();

        if (
            !payload ||
            !payload.email ||
            !payload.sub
        ) {
            throw new UnauthorizedException(
                'Invalid Google account',
            );
        }

        if (!payload.email_verified) {
            throw new UnauthorizedException(
                'Google email is not verified',
            );
        }

        const email = payload.email.toLowerCase();

        let user = await this.userModel.findOne({
            $or: [
                {
                    googleId: payload.sub,
                },
                {
                    email,
                },
            ],
        });

        if (!user) {
            // First time Google user
            user = await this.userModel.create({
                email,
                googleId: payload.sub,
                name: payload.name ?? '',
                photo: payload.picture ?? '',
                providers: ['google'],
                onboardingCompleted: false,
            });
        } else {
            // Existing email account can also use Google
            user.googleId = payload.sub;

            if (payload.name) {
                user.name = payload.name;
            }

            if (payload.picture) {
                user.photo = payload.picture;
            }

            if (!user.providers.includes('google')) {
                user.providers.push('google');
            }

            await user.save();
        }

        return this.createAuthResponse(user);
    }

    // ==========================================
    // JWT RESPONSE
    // ==========================================

    private async createAuthResponse(
        user: UserDocument,
    ) {
        const accessToken =
            await this.jwtService.signAsync({
                sub: user._id.toString(),
                email: user.email,
            });

        return {
            accessToken,

            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name ?? '',
                photo: user.photo ?? '',
                providers: user.providers,
                age: user.age,
                height: user.height,
                weight: user.weight,
                fitnessGoal: user.fitnessGoal,
                onboardingCompleted:
                    user.onboardingCompleted,
            },
        };
    }
}
