const mongoose = require("mongoose");
const orgService = require("./organization.service");
const orgMemberService = require("../organizationMember/organizationMember.service");
const { successResponse } = require("../../utils/apiResponse");
const ORG_PERMISSIONS = require("../../constant/organizationPermissions.constant");

async function createOrg(req, res, next) {
  const session = await mongoose.startSession();
  try {
    let organization;
    await session.withTransaction(async () => {
      organization = await orgService.createOrganizationWithOwner(
        {
          name: req.body.name,
          description: req.body.description,
          ownerId: req.user.id,
        },
        session,
      );
    });

    successResponse(
      res,
      201,
      "Organization created successfully",
      organization,
    );
  } catch (err) {
    next(err);
  } finally {
    session.endSession();
  }
}

async function getMyOrganizations(req, res, next) {
  try {
    const { page, limit, status } = req.query;

    const result = await orgMemberService.getMyOrganizations(
      req.user.id,
      page,
      limit,
      status,
    );
    console.log("Fetched organizations for user:", result);
    const formattedOrgs = result.data.map((member) => ({
      organization: {
        id: member.organization._id,
        name: member.organization.name,
        slug: member.organization.slug,
        description: member.organization.description,
        owner: String(member.organization.owner) === String(req.user.id),
      },
      totalProjects: member.totalProjects,
      totalMembers: member.totalMembers,
    }));

    return successResponse(res, 200, "Organizations fetched successfully", {
      data: formattedOrgs,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
}

async function getOrganizationBySlug(req, res, next) {
  try {
    const { organization, membership, user } = req;

    const response = {
      organization: {
        id: organization._id,
        name: organization.name,
        slug: organization.slug,
        owner: String(organization.owner) === String(user.id),
        description : organization?.description,
        createdAt: organization?.createdAt
      },
      membership: {
        role: membership.role,
        status: membership.status,
        joinedAt: membership.joinedAt,
      },
      permissions: ORG_PERMISSIONS[membership.role] || {},
    };

    return successResponse(
      res,
      200,
      "Organization fetched successfully",
      response,
    );
  } catch (err) {
    next(err);
  }
}

async function getOrgMembers(req, res, next) {
  try {
    const { organization } = req;
    const { page, limit, role } = req.query;
    const members = await orgMemberService.getOrgMembers(
      organization._id,
      page,
      limit,
      role,
    );
    return successResponse(
      res,
      200,
      "Organization members fetched successfully",
      members,
    );
  } catch (err) {
    next(err);
  }
}

async function deleteOrganization(req, res, next) {
  try {
    const { organization } = req;

    await orgService.deleteOrganization({
      organizationId: organization._id,
      actorUserId: req.user.id,
    });

    return successResponse(res, 200, "Organization deleted successfully");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrg,
  getMyOrganizations,
  getOrganizationBySlug,
  getOrgMembers,
  deleteOrganization,
};
