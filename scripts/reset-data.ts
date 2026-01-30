import * as fs from "fs";
import * as path from "path";

function resetData() {
  console.log("=== Data Reset ===\n");

  const DATA_DIR = path.join(process.cwd(), "data");

  if (!fs.existsSync(DATA_DIR)) {
    console.log("No data directory found. Nothing to reset.");
    process.exit(0);
  }

  const files = fs.readdirSync(DATA_DIR);
  
  if (files.length === 0) {
    console.log("Data directory is empty. Nothing to reset.");
    process.exit(0);
  }

  console.log("Removing files:");
  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    fs.unlinkSync(filePath);
    console.log(`  - ${file}`);
  }

  console.log("\n=== Reset complete ===");
  console.log("All local study data has been removed.");
  console.log("The application will start fresh on next run.");
  process.exit(0);
}

resetData();
