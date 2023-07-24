import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { format, zonedTimeToUtc } from 'date-fns-tz';
import { NodeEnv } from '@common/@types/enums/common.enum';

export const HelperService = {
  isDev(): boolean {
    return process.env.NODE_ENV === NodeEnv.DEVELOPMENT;
  },

  isProd(): boolean {
    return process.env.NODE_ENV === NodeEnv.PRODUCTION;
  },

  getAppRootDir() {
    let currentDirectory = __dirname;

    while (!existsSync(join(currentDirectory, 'resources'))) {
      currentDirectory = join(currentDirectory, '..');
    }

    return process.env.NODE_ENV === NodeEnv.PRODUCTION
      ? join(currentDirectory, 'dist')
      : currentDirectory;
  },

  /* The `getTimeInUtc` function takes a `Date` object or a string representation of a date as input and
	returns a new `Date` object representing the same date and time in UTC timezone. */
  getTimeInUtc(date: Date | string): Date {
    const thatDate = date instanceof Date ? date : new Date(date);
    const currentUtcTime = zonedTimeToUtc(thatDate, 'UTC');

    return new Date(format(currentUtcTime, 'yyyy-MM-dd HH:mm:ss'));
  },
};
