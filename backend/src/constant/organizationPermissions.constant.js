const ORG_PERMISSIONS = {
  ADMIN: {
    canCreateProject: true,
    canInviteMember: true,
    canRemoveMember: true,
    canDeleteOrganization: true
  },

  MANAGER: {
    canCreateProject: true,
    canInviteMember: false,
    canRemoveMember: false,
    canDeleteOrganization: false
  },

  MEMBER: {
    canCreateProject: false,
    canInviteMember: false,
    canRemoveMember: false,
    canDeleteOrganization: false
  }
};

module.exports = ORG_PERMISSIONS;
