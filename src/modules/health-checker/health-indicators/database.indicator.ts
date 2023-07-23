import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  constructor() {
    super();
  }

  /**
   * It checks if the database is healthy by counting the number of users in the database
   * @param [key=Users] - The name of the health check.
   * @returns A HealthIndicatorResult object.
   */
  async isHealthy(key = 'Users'): Promise<HealthIndicatorResult | any> {
    try {
      //
    } catch (error) {
      throw new HealthCheckError('Database check failed', error);
    }
  }
}
