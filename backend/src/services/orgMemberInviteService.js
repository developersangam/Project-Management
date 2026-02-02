const OrganizationInvite = require("../models/OrganizationInvite");

async function inviteMember(data) {
    return await OrganizationInvite.create(data);
}

async function getInviteByEmailAndStatus(organizationId , email, status) {
    return await OrganizationInvite.findOne({ organizationId, email, status ,expiresAt: { $gt: new Date() }});
}

async function getInviteByTokenHash(tokenHash) {
    return await OrganizationInvite.findOne({ tokenHash});
}

module.exports = { inviteMember,getInviteByEmailAndStatus, getInviteByTokenHash };