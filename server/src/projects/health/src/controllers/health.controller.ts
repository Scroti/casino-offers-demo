import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { DiskHealthIndicator, HealthCheck, HealthCheckResult, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus'
import { type HealthIndicatorFunction } from '@nestjs/terminus/dist/health-indicator'

import * as os from 'os'

// import { Roles, RolesGuard } from '@cariad/guards'

@ApiBearerAuth('JWT')
@ApiTags('Cariad CI/CD Health API')
// @UseGuards(RolesGuard)
@Controller('health')
export class HealthController {
  private readonly healthIndicators: HealthIndicatorFunction[] = [
    () =>
      this.diskHealthIndicator.checkStorage('storage', {
        path: os.platform() === 'win32' ? 'C:\\' : '/',
        thresholdPercent: 0.8,
      }),
    () => this.memoryHealthIndicator.checkHeap('memory_heap', 150 * 1024 * 1024),
  ]

  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly diskHealthIndicator: DiskHealthIndicator,
    private readonly memoryHealthIndicator: MemoryHealthIndicator
  ) {}

  @Get()
//   @Roles('VWAG_IVI_CICD_SUPER_USER')
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check(this.healthIndicators)
  }
}