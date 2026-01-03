import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export interface TwoFactorSecret {
  secret: string;
  otpauth_url: string;
  qrCode: string;
}

export async function generateTwoFactorSecret(email: string): Promise<TwoFactorSecret> {
  const secret = speakeasy.generateSecret({
    name: `Leadify CRM (${email})`,
    issuer: 'Leadify',
    length: 20
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

  return {
    secret: secret.base32,
    otpauth_url: secret.otpauth_url || '',
    qrCode
  };
}

export function verifyTwoFactorToken(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2
  });
}

export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    codes.push(code);
  }
  return codes;
}
