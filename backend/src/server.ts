import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/database.js";

const PORT = env.PORT;

async function startServer() {
  try {
    // Test MongoDB connection
    await prisma.$connect();
    console.log("✓ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/health`);
      console.log(`   API base: http://localhost:${PORT}/api\n`);
    });
  } catch (error) {
    console.error("✗ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n\nShutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n\nShutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
