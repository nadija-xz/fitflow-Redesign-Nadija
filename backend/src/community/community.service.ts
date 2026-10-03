import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthService } from '../auth/auth.service.js';
import { CommunityMessage, MessageDocument } from './message.schema.js';

@Injectable()
export class CommunityService {
  constructor(
    private readonly auth: AuthService,
    @InjectModel(CommunityMessage.name) private readonly messages: Model<MessageDocument>,
  ) {}

  async list(authorization: string | undefined, before?: string) {
    await this.auth.authenticatedUser(authorization);
    if (before !== undefined && !/^[a-f\d]{24}$/i.test(before)) throw new BadRequestException('Invalid message cursor');
    const rows = await this.messages.find({
      group: 'main',
      ...(before ? { _id: { $lt: new Types.ObjectId(before) } } : {}),
    }).sort({ _id: -1 }).limit(51).exec();
    const hasMore = rows.length > 50;
    const messages = rows.slice(0, 50).reverse().map(row => this.serialize(row));
    return { group: { id: 'main', name: 'Fit Flow Community' }, messages, hasMore };
  }

  async send(authorization: string | undefined, body: unknown) {
    const user = await this.auth.authenticatedUser(authorization);
    const text = body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>).text : undefined;
    if (typeof text !== 'string' || !text.trim() || text.trim().length > 1000) {
      throw new BadRequestException('Write a message between 1 and 1000 characters');
    }
    const row = await this.messages.create({
      group: 'main', senderId: user._id,
      senderName: user.name?.trim() || user.email.split('@')[0],
      text: text.trim(),
    });
    return this.serialize(row);
  }

  private serialize(row: MessageDocument) {
    return { id: row._id.toString(), senderId: row.senderId.toString(), senderName: row.senderName, text: row.text, createdAt: row.createdAt.toISOString() };
  }
}
