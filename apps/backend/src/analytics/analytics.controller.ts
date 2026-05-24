import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';
import { Roles, RolesGuard } from '../auth/roles.guard';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboardStats();
  }
}
