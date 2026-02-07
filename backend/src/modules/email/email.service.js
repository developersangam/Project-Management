const nodemailer = require("nodemailer");
const { emailConfig } = require("../../config/email.config");
const { inviteMemberTemplate } = require("./email.template");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport(emailConfig);
  }

  async sendOrganizationInvite({
    to,
    inviterName,
    organizationName,
    inviteLink,
  }) {
    const html = inviteMemberTemplate({
      inviterName,
      organizationName,
      inviteLink,
    });

    await this.transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to,
      subject: `You're invited to join ${organizationName}`,
      html,
    });
  }
}

module.exports = new EmailService();
