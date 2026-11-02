import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PickupService } from './pickup.service';

@UseGuards(AuthGuard('jwt'))
@Controller('pickup')
export class PickupController {
  constructor(private readonly pickupService: PickupService) {}

  @Get('student/:studentId')
  getAuthorizedPersons(@Param('studentId') studentId: string) {
    return this.pickupService.getAuthorizedPersons(studentId);
  }

  @Post('authorize-eventual')
  createEventualAuthorization(@Body() body: any) {
    return this.pickupService.createEventualAuthorization(body);
  }

  @Post('record-egress')
  recordPickup(@Body() body: any, @Request() req: any) {
    return this.pickupService.recordPickup(body, req.user.id);
  }
}

