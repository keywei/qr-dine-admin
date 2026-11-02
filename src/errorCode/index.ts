import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types/api';
import i18n from '../locales';
import error400 from './400';
import error500 from './500';
import error1000 from './1000';
import error2000 from './2000';

const DEFAULT_CODE = -1;

export const ERROR_MESSAGES: Record<number, string> = {
  '-1': i18n.global.t('api.noErrorCode'),
  ...error400,
  ...error500,
  ...error1000,
  ...error2000,
};

export const codeToMessage = <T extends ApiResponse>(
  error: AxiosError<T>,
  code = DEFAULT_CODE
): AxiosError<T> => {
  return Object.assign(error, {
    message: ERROR_MESSAGES[code] || error.response?.data?.message || i18n.global.t('api.errorCodePrefix', { code }),
  });
};
