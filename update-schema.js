import fs from "fs";
import path from "path";

const dir = "./conjectures"; // adjust if your JSONs live elsewhere

const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));

let updated = 0;
for (const file of files) {
  const filePath = path.join(dir, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  let changed = false;

  if (!("status" in data)) {
    data.status = "active";
    changed = true;
  }

  if (!("history" in data)) {
    data.history = [
      {
        action: "schema_init",
        user: "system",
        timestamp: new Date().toISOString(),
        note: "Added default status/history fields"
      }
    ];
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    updated++;
  }
}

console.log(`✅ Updated ${updated} of ${files.length} JSON files.`);
