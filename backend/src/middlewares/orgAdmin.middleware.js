import { AppError } from "../utils/AppError.js";

/**
 * Middleware to ensure current user is an organization admin or owner
 * Must run after getOrganizationBySlug middleware
 */
export const requireAdmin = (req, res, next) => {
  console.log("Checking admin access for user:", req.user?.id);
  try {
    const membership = req.membership;
    // 1️⃣ User must be a member
    if (!membership) {
      return next(
        new AppError(403, "You are not a member of this organization"),
      );
    }

    // 2️⃣ Check if role is OWNER or ADMIN
    const role = membership.role;
    if (!["OWNER", "ADMIN"].includes(role)) {
      return next(new AppError(403, "Admin access required"));
    }

    // ✅ Passed, continue
    next();
  } catch (err) {
    next(err);
  }
};
