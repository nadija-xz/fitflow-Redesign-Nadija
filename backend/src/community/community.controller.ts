import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { CommunityService } from './community.service.js';

@Controller('community')
export class CommunityController {
  constructor(private readonly community: CommunityService) {}

  @Get('messages')
  list(@Headers('authorization') authorization: string | undefined, @Query('before') before?: string) {
    return this.community.list(authorization, before);
  }

  @Post('messages')
  send(@Headers('authorization') authorization: string | undefined, @Body() body: unknown) {
    return this.community.send(authorization, body);
  }
}
