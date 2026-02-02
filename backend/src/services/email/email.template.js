function inviteMemberTemplate({ inviterName, organizationName, inviteLink }) {
  return `
    <div>
      <h2>You’ve been invited!</h2>
      <p><strong>${inviterName}</strong> invited you to join <strong>${organizationName}</strong>.</p>
      <p>
        <a href="${inviteLink}" target="_blank">Accept Invitation</a>
      </p>
      <p>This invite will expire in 48 hours.</p>
    </div>
  `;
}

module.exports = { inviteMemberTemplate };
