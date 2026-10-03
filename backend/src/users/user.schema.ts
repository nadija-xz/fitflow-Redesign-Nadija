import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
    timestamps: true,
})
export class User {
    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    email!: string;

    @Prop({
        select: false,
    })
    passwordHash?: string;

    @Prop({
        default: '',
        trim: true,
    })
    name?: string;

    @Prop({
        default: '',
    })
    photo?: string;

    @Prop({
        unique: true,
        sparse: true,
    })
    googleId?: string;

    @Prop({
        type: [String],
        default: [],
    })
    providers!: string[];

    @Prop({
        default: false,
    })
    onboardingCompleted!: boolean;

    @Prop()
    age?: number;

    @Prop()
    height?: number;

    @Prop()
    weight?: number;

    @Prop()
    fitnessGoal?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);