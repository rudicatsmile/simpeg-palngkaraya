import fs from "fs";
import path from "path";

function findFiles(dir, list = []) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      findFiles(full, list);
    } else if (f.endsWith(".tsx") || f.endsWith(".ts")) {
      const content = fs.readFileSync(full, "utf8");
      if (content.includes("@/data/dummy")) {
        const isClient = content.includes('"use client"') || content.includes("'use client'");
        // Extract imported identifiers
        const match = content.match(/import\s*\{([^}]+)\}\s*from\s*["']@\/data\/dummy["']/);
        const imported = match ? match[1].split(",").map((s) => s.trim()) : [];
        list.push({ file: full.replace(/\\/g, "/"), isClient, imported });
      }
    }
  }
  return list;
}

const list = findFiles("d:/project/mobile/e-simpeg/src");
console.log("Total files importing @/data/dummy:", list.length);
const clientCount = list.filter((x) => x.isClient).length;
console.log("Client components:", clientCount);
console.log("Server components / API:", list.length - clientCount);

const importFreq = {};
for (const item of list) {
  for (const imp of item.imported) {
    importFreq[imp] = (importFreq[imp] || 0) + 1;
  }
}
console.log("\nImport Frequencies:\n", JSON.stringify(importFreq, null, 2));
