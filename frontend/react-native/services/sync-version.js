import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const rootDir = path.join(__dirname, ".."); // project root
const packageJsonPath = path.join(rootDir, "package.json");
const appJsonPath = path.join(rootDir, "app.json");
const packageLockPath = path.join(rootDir, "package-lock.json");
const buildJsPath = path.join(__dirname, "build.js"); // /services/build.js

// Read BUILD_INFO from build.js
const buildJsContent = fs.readFileSync(buildJsPath, "utf8");
const match = buildJsContent.match(/BUILD_INFO\s*=\s*["'`](.*?)["'`]/);

if (!match) {
  console.error("❌ Could not find BUILD_INFO in build.js");
  process.exit(1);
}

const buildInfo = match[1];

// ---- Update package.json ----
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
if (packageJson.expo) {
  packageJson.expo.version = buildInfo;
}
packageJson.version = buildInfo;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// ---- Update app.json ----
if (fs.existsSync(appJsonPath)) {
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
  if (appJson.expo) {
    appJson.expo.version = buildInfo;
  }
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
}

// ---- Update package-lock.json ----
if (fs.existsSync(packageLockPath)) {
  const packageLock = JSON.parse(fs.readFileSync(packageLockPath, "utf8"));
  packageLock.version = buildInfo;
  fs.writeFileSync(packageLockPath, JSON.stringify(packageLock, null, 2));
}

console.log(
  `✅ Updated package.json, app.json, and package-lock.json version to ${buildInfo}`
);
