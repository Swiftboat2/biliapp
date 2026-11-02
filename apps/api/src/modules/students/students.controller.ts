import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StudentsService } from './students.service';

@UseGuards(AuthGuard('jwt'))
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('my-children')
  getMyChildren(@Request() req: any) {
    return this.studentsService.getGuardianStudents(req.user.id);
  }

  @Get(':id/dashboard')
  getStudentDashboard(@Param('id') id: string) {
    return this.studentsService.getStudentDashboard(id);
  }
}

