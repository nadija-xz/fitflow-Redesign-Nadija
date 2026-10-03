import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MessageDocument = HydratedDocument<CommunityMessage>;

@Schema({ timestamps: true })
export class CommunityMessage {
  @Prop({ required: true, default: 'main', enum: ['main'] })
  group!: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  senderId!: Types.ObjectId;

  @Prop({ required: true })
  senderName!: string;

  @Prop({ required: true, trim: true, maxlength: 1000 })
  text!: string;

  createdAt!: Date;
}

export const CommunityMessageSchema = SchemaFactory.createForClass(CommunityMessage);
CommunityMessageSchema.index({ group: 1, _id: -1 });
