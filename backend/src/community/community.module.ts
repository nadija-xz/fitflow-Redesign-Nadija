import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module.js';
import { CommunityMessage, CommunityMessageSchema } from './message.schema.js';
import { CommunityController } from './community.controller.js';
import { CommunityService } from './community.service.js';

@Module({
  imports: [AuthModule, MongooseModule.forFeature([{ name: CommunityMessage.name, schema: CommunityMessageSchema }])],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
