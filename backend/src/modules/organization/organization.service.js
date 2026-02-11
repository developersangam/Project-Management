const Organization = require('./organization.model');
const organizationMemberModel = require('../organizationMember/organizationMember.model');
const generateSlug = require('../../utils/generateSlug');

async function createOrganizationWithOwner({ name, ownerId }, session) {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (await Organization.exists({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const [organization] = await Organization.create([{
    name,
    slug,
    owner: ownerId,
    isActive: true,
  }], { session });

  await organizationMemberModel.create([{
    organizationId: organization._id,
    userId: ownerId,
    role: "ADMIN",
    status: "ACTIVE",
    joinedAt: new Date(),
    invitedBy: null,
  }], { session });

  return organization;
}

async function isSlugExist(slug) {  
  const org = await Organization.exists({ slug });
  return org;
}
async function getOrgBySlug(slug) {
  console.log("Getting organization by slug:", slug);
  return await  Organization.findOne({ slug }).lean();
}

async function listOrgs(filter = {}) {
  return Organization.find(filter).populate('members').lean();
}


async function updateOrg(id, updates) {
  return Organization.findByIdAndUpdate(id, updates, { new: true }).populate('members');
}

async function deleteOrg(id) {
  return Organization.findByIdAndDelete(id);
}

module.exports = { createOrganizationWithOwner, isSlugExist,listOrgs, getOrgBySlug, updateOrg, deleteOrg };
