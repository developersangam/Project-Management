const orgService = require('../services/orgService');

async function createOrg(req, res, next) {
  try {
    const org = await orgService.createOrg(req.body);
    res.status(201).json(org);
  } catch (err) {
    next(err);
  }
}

async function listOrgs(req, res, next) {
  try {
    const orgs = await orgService.listOrgs();
    res.json(orgs);
  } catch (err) {
    next(err);
  }
}

async function getOrg(req, res, next) {
  try {
    const org = await orgService.getOrgById(req.params.id);
    if (!org) return res.status(404).json({ error: 'Organization not found' });
    res.json(org);
  } catch (err) {
    next(err);
  }
}

async function updateOrg(req, res, next) {
  try {
    const org = await orgService.updateOrg(req.params.id, req.body);
    res.json(org);
  } catch (err) {
    next(err);
  }
}

async function deleteOrg(req, res, next) {
  try {
    await orgService.deleteOrg(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrg, listOrgs, getOrg, updateOrg, deleteOrg };
