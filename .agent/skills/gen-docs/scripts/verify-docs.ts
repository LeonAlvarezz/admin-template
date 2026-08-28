import path from "path";

const backendDir = path.resolve(import.meta.dir, "../../../../apps/backend");
process.chdir(backendDir);

const { openApiSpec } = await import(path.join(backendDir, "src/config/openapi.config"));

const paths = (openApiSpec as any).paths || {};
const pathKeys = Object.keys(paths).sort();

console.log("=== Registered OpenAPI & Scalar Endpoints ===");
pathKeys.forEach((p) => {
  const methods = Object.keys(paths[p]).map((m) => m.toUpperCase()).join(", ");
  const summary = Object.values(paths[p]).map((op: any) => op.summary).filter(Boolean).join(" | ");
  console.log(`• [${methods}] ${p} - ${summary || "No summary"}`);
});
console.log(`\nTotal Documented Endpoints: ${pathKeys.length}`);
