'use client';

import { getCookie, setCookie } from '../utils/cookieUtils';

export { getCookie };

export const updateSetting = (name: string, value: string, setter: (val: string) => void) => {
  setter(value);
  setCookie(name, value);
};
