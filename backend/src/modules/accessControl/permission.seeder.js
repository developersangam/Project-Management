const Permission =  require("./permission.model.js");
const { DEFAULT_PERMISSIONS } = require("../../constant/permission.constant.js");

const seedPermissions = async () => {
  try {
    for (const permission of DEFAULT_PERMISSIONS) {
      await Permission.updateOne(
        { key: permission.key },
        { $setOnInsert: permission },
        { upsert: true }
      );
    }

    console.log("✅ Permissions seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding permissions:", error);
  }
};

module.exports = {
  seedPermissions,
};
