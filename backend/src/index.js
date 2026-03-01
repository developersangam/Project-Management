require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db.config");

const userRoutes = require("./modules/user/user.routes");
const organizationRoutes = require("./modules/organization/organization.routes");
const { globalErrorHandler } = require("./middlewares/error.middleware");
const { seedPermissions } = require("./modules/accessControl/permission.seeder");
const seedProjectRoles = require("./modules/accessControl/projectRole.seeder");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/orgs", organizationRoutes);

// Health
app.get("/", (req, res) =>
  res.json({ ok: true, time: new Date().toISOString() }),
);

// Error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, async () => {
      console.log(`Server listening on port ${PORT}`);
      if (process.env.SEED_DATA === "true") {
        await seedPermissions();
        await seedProjectRoles()
      }
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = app;
