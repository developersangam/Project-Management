import { findMember } from "../services/orgMemberService.js";
import { getOrgBySlug } from "../services/orgService.js";
import { AppError } from "../utils/AppError.js";
/**
 * Middleware to load organization by slug
 * and attach it + current user's membership to the request
 */
export const getOrganizationBySlug = async (req, res, next) => {
  try {
    console.log("Loading organization for slug:", req.params.slug);
    const { slug } = req.params;

    // 1️⃣ Find organization by slug
    const organization = await getOrgBySlug(slug);
    console.log("Organization found:", organization);

    if (!organization) {
      throw new AppError(404, "Organization not found");
    }

    // 2️⃣ Check if organization is active
    if (!organization.isActive) {
      throw new AppError(403, "Organization is inactive");
    }

    // 3️⃣ Attach organization to request
    req.organization = organization;
    console.log("Organization attached to request:", req.organization);
    console.log("User attached to request:", req.user?.id || "No user");
    // 4️⃣ Fetch current user's membership if authenticated
    if (req.user?.id) {
      const membership = await findMember(organization._id, req.user.id);
      console.log("User membership found:", membership);
      req.membership = membership || null;
    }
    next();
  } catch (err) {
    next(err);
  }
};
