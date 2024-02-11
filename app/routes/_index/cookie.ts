import { createCookie } from '@remix-run/node';

export const cookieName = 'bc-state';
export const stateCookie = createCookie(cookieName);
