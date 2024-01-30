const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const config = require("../config");

const mailer = new MailerSend({
  apiKey: config.mailer_send_api_key,
});

const sendEmail = async (toEmail, toName, subject, template, new_password, attachments = []) => {
  const sentFrom = new Sender("no-reply@xxxxxxxxxxxxxx", "xxxxxxxxxxx"); //TODO: IMPLEMENTAR

  const recipients = [new Recipient(toEmail, toName)];

  const personalization = [
    {
      email: toEmail,
      data: {
        name: toName,
        new_password: new_password ? new_password : undefined,
      },
    },
  ];

  let emailParams = new EmailParams().setFrom(sentFrom).setTo(recipients).setReplyTo(sentFrom).setSubject(subject).setPersonalization(personalization).setTemplateId(template);
  if (attachments && attachments.length > 0) emailParams.setAttachments(attachments);

  try {
    const response = await mailer.email.send(emailParams);
    return { status: response.status, statusText: response.statusText };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendEmail,
};
