import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KindergartenService } from './kindergarten.service';
import { DailyKindergartenLog } from '@biliapp/database';

@UseGuards(AuthGuard('jwt'))
@Controller('kindergarten')
export class KindergartenController {
  constructor(private readonly kindergartenService: KindergartenService) {}

  @Get(':studentId/daily-log')
  async getDailyLog(
    @Param('studentId') studentId: string,
    @Query('date') date: string,
  ): Promise<DailyKindergartenLog | null> {
    const queryDate = date || new Date().toISOString().split('T')[0];
    return this.kindergartenService.getDailyLog(studentId, queryDate);
  }

  @Post('daily-log')
  async saveDailyLog(@Body() body: any, @Request() req: any): Promise<DailyKindergartenLog> {
    return this.kindergartenService.saveDailyLog(body, req.user.id);
  }
}
