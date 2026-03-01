const Permission = require("./permission.model");
const ProjectRole = require("./projectRole.model");

const DEFAULT_PROJECT_ROLES = [
  {
    key: "PROJECT_ADMIN",
    description: "Full access to project",
    permissions: "ALL", // special flag
    level: 3,
  },

  {
    key: "PROJECT_MANAGER",
    description: "Manage project and tasks",
    permissions: [
      // Project permissions
      "UPDATE_PROJECT",
      "ADD_PROJECT_MEMBER",
      "REMOVE_PROJECT_MEMBER",
      "CHANGE_PROJECT_ROLE",

      // Task permissions
      "CREATE_TASK",
      "UPDATE_TASK",
      "DELETE_TASK",
    ],
    level: 2,
  },

  {
    key: "PROJECT_MEMBER",
    description: "Basic task access",
    permissions: ["CREATE_TASK", "UPDATE_TASK"],
    level: 1,
  },
];

async function seedProjectRoles() {
  try {
    // Get all active permissions
    const permissions = await Permission.find({ isActive: true });

    if (!permissions.length) {
      console.warn("⚠ No permissions found. Seed permissions first.");
      return;
    }

    // Create permission map: key -> _id
    const permissionMap = {};
    permissions.forEach((p) => {
      permissionMap[p.key] = p._id;
    });

    for (const role of DEFAULT_PROJECT_ROLES) {
      let permissionIds = [];

      if (role.permissions === "ALL") {
        permissionIds = permissions.map((p) => p._id);
      } else {
        permissionIds = role.permissions
          .map((key) => permissionMap[key])
          .filter(Boolean); // remove undefined if key missing
      }

      await ProjectRole.updateOne(
        { key: role.key },
        {
          $set: {
            description: role.description,
            permissions: permissionIds,
            level: role.level,
          },
          $setOnInsert: {
            key: role.key,
          },
        },
        { upsert: true },
      );
    }

    console.log("✅ Project roles seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding project roles:", error);
  }
}

module.exports = seedProjectRoles;
