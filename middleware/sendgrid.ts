import SendGridMail from '@sendgrid/mail';

const FROM = { name: 'Tom at YouFound', email: 'tom@tomhowland.com' };

async function sendEmail(data: Omit<SendGridMail.MailDataRequired, 'from'>) {
  SendGridMail.setApiKey(process.env.SENDGRID_API_KEY!);

  return SendGridMail.send({
    ...data,
    from: FROM
  } as SendGridMail.MailDataRequired);
}

export default { sendEmail };
