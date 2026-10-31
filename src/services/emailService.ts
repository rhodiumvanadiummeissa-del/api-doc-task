import { logger } from '../config/logger';

export async function sendOtpEmail(toEmail: string, otpCode: string): Promise<void> {
  // Dummy OTP Dispatch: Log to console for local dev & automated testing
  logger.info(`==================================================`);
  logger.info(`[DUMMY EMAIL SERVICE] OTP Sent to: ${toEmail}`);
  logger.info(`[DUMMY EMAIL SERVICE] Verification Code: ${otpCode}`);
  logger.info(`==================================================`);
}