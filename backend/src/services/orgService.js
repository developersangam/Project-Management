const Organization = require('../models/Organization');

async function createOrg(data,session) {
  console.log("Creating organization with data:", data);
  const [org] = await Organization.create([data], {session});
  return org
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

module.exports = { createOrg, isSlugExist,listOrgs, getOrgBySlug, updateOrg, deleteOrg };
