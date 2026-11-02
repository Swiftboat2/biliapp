import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttendanceService } from './attendance.service';

@UseGuards(AuthGuard('jwt'))
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('student/:studentId')
  getStudentAttendance(@Param('studentId') studentId: string) {
    return this.attendanceService.getStudentAttendanceHistory(studentId);
  }

  @Post('certificate')
  uploadCertificate(
    @Body() body: { detailId: string; certUrl: string; notes?: string },
  ) {
    return this.attendanceService.uploadMedicalCertificate(
      body.detailId,
      body.certUrl,
      body.notes,
    );
  }

  @Post('take')
  takeAttendance(@Body() body: any, @Request() req: any) {
    return this.attendanceService.takeAttendance(body, req.user.id);
  }
}

