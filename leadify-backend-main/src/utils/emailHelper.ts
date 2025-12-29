import settingService from "../setting/settingService";
import BaseError from "./error/base-http-exception";
import { ERRORS } from "./error/errors";

const SibApiV3Sdk = require('sib-api-v3-sdk');


const defaultClient = SibApiV3Sdk.ApiClient.instance;

const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

interface EmailAttachment {
  name: string;
  content: string; // base64 encoded
}

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachment?: EmailAttachment;
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
  attachment
}: SendEmailOptions): Promise<void> {
  const setting = await settingService.getSetting();
  if (!setting?.emailApiKey) throw new BaseError(ERRORS.MISSING_EMAIL_CONFIGURATION);
  defaultClient.authentications['api-key'].apiKey = setting.emailApiKey;//process.env.BREVO_API_KEY!;

  const emailParams = {
    to: [{ email: to }],
    sender: { name: 'HP Tech App', email: 'app@hp-tech.com' },
    subject,
    textContent: text,
    htmlContent: html,
    attachment: attachment ? [attachment] : undefined
  };

  await transactionalEmailsApi.sendTransacEmail(emailParams);
}
