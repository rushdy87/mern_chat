import { Resend } from 'resend';
import { requireEnv } from './env.js';

export const resendClient = new Resend(requireEnv('RESEND_API_KEY'));

export const sender = {
  email: requireEnv('EMAIL_FROM'),
  name: requireEnv('EMAIL_FROM_NAME'),
};
