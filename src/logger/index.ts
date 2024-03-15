import log from 'loglevel';
import { getConfig } from '../config';

const { logLevel } = getConfig();

log.setLevel(logLevel);

export const logger = {
  info: (message: string) => log.info(message),
  warn: (message: string) => log.warn(message),
  error: (message: string) => log.error(message),
};