import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommunicationsService } from './communications.service';

@UseGuards(AuthGuard('jwt'))
@Controller('communications')
export class CommunicationsController {
  constructor(private readonly commsService: CommunicationsService) {}

  @Get('inbox')
  getInbox(@Request() req: any) {
    return this.commsService.getGuardianCommunications(req.user.id);
  }

  @Post(':recipientId/read')
  markRead(@Param('recipientId') recipientId: string, @Request() req: any) {
    return this.commsService.markAsRead(recipientId, req.user.id);
  }

  @Post(':recipientId/sign-pin')
  signWithPin(
    @Param('recipientId') recipientId: string,
    @Body('pin') pin: string,
    @Request() req: any,
  ) {
    return this.commsService.signWithPin(recipientId, req.user.id, pin);
  }
}

