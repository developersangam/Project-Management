const Organization = require('../models/Organization');

async function createOrg(data) {
  const org = new Organization(data);
  return org.save();
}

async function listOrgs(filter = {}) {
  return Organization.find(filter).populate('members').lean();
}

async function getOrgById(id) {
  return Organization.findById(id).populate('members').lean();
}

async function updateOrg(id, updates) {
  return Organization.findByIdAndUpdate(id, updates, { new: true }).populate('members');
}

async function deleteOrg(id) {
  return Organization.findByIdAndDelete(id);
}

module.exports = { createOrg, listOrgs, getOrgById, updateOrg, deleteOrg };
