#!/usr/bin/env node
import {
  intro,
  outro,
  select,
  text,
  spinner,
  isCancel,
  cancel,
} from "@clack/prompts";
import pc from "picocolors";
import { downloadTemplate } from "giget";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

async function main() {
  console.clear();
  intro(pc.bgCyan(pc.black(" create-z3-admin ")));

  // 1. Target directory
  let targetDir = process.argv[2];
  if (!targetDir || targetDir.startsWith("-")) {
    const dirInput = await text({
      message: "Where should we create your project?",
      placeholder: "./my-z3-admin",
      defaultValue: "./my-z3-admin",
    });

    if (isCancel(dirInput)) {
      cancel("Scaffolding cancelled.");
      process.exit(0);
    }
    targetDir = dirInput;
  }

  const projectPath = path.resolve(process.cwd(), targetDir);
  const projectName = path.basename(projectPath);

  if (fs.existsSync(projectPath) && fs.readdirSync(projectPath).length > 0) {
    const shouldOverwrite = await select({
      message: `Directory ${pc.yellow(targetDir)} is not empty. How would you like to proceed?`,
      options: [
        { value: "overwrite", label: "Empty directory and continue" },
        { value: "cancel", label: "Cancel installation" },
      ],
    });

    if (isCancel(shouldOverwrite) || shouldOverwrite === "cancel") {
      cancel("Scaffolding cancelled.");
      process.exit(0);
    }

    fs.rmSync(projectPath, { recursive: true, force: true });
  }

  // 2. Select Template Variant
  const variant = await select({
    message: "Select template configuration:",
    options: [
      {
        value: "mock",
        label: "🎨 Standalone Frontend (Mock Data)",
        hint: "Zero backend/database setup, in-memory stateful API",
      },
      {
        value: "fullstack",
        label: "⚡ Fullstack Monorepo",
        hint: "React 19 + Express 5 + PostgreSQL + Drizzle + Better Auth",
      },
    ],
  });

  if (isCancel(variant)) {
    cancel("Scaffolding cancelled.");
    process.exit(0);
  }

  // 3. Download template
  const s = spinner();
  s.start(`Downloading Z3 Admin template into ${pc.cyan(targetDir)}...`);

  try {
    await downloadTemplate("github:LeonAlvarezz/admin-template#main", {
      dir: projectPath,
      force: true,
    });
    s.stop("Template files downloaded.");
  } catch (err) {
    s.stop("Template download failed.");
    console.error(err);
    process.exit(1);
  }

  // 4. Transform project structure
  s.start("Configuring template...");

  // Remove internal scaffolding package and AI metadata from user project
  const internalCliPath = path.join(projectPath, "packages/create-z3-admin");
  if (fs.existsSync(internalCliPath)) {
    fs.rmSync(internalCliPath, { recursive: true, force: true });
  }
  const agentDir = path.join(projectPath, ".agent");
  if (fs.existsSync(agentDir)) {
    fs.rmSync(agentDir, { recursive: true, force: true });
  }

  const rootPkgPath = path.join(projectPath, "package.json");
  let rootPkg = {};
  if (fs.existsSync(rootPkgPath)) {
    rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf-8"));
    rootPkg.name = projectName;
  }

  if (variant === "mock") {
    // Remove backend and docker configuration
    const backendPath = path.join(projectPath, "apps/backend");
    const dockerComposePath = path.join(projectPath, "docker-compose.yml");

    if (fs.existsSync(backendPath)) {
      fs.rmSync(backendPath, { recursive: true, force: true });
    }
    if (fs.existsSync(dockerComposePath)) {
      fs.rmSync(dockerComposePath, { force: true });
    }

    // Write mock environment file
    const starterEnvPath = path.join(projectPath, "apps/starter/.env");
    fs.writeFileSync(
      starterEnvPath,
      "# Mock Data Mode (In-memory CRUD handlers)\nVITE_ENABLE_MOCK=true\n",
    );

    // Prune backend scripts from root package.json
    if (rootPkg.scripts) {
      delete rootPkg.scripts["db:migrate"];
      delete rootPkg.scripts["db:push"];
      delete rootPkg.scripts["db:reset"];
      delete rootPkg.scripts["db:seed"];
      delete rootPkg.scripts["docker:up"];
      delete rootPkg.scripts["docker:down"];
      delete rootPkg.scripts["setup"];
      rootPkg.scripts["dev"] = "bun --cwd apps/starter dev";
    }
  } else {
    // Fullstack: Set up .env files
    const backendEnvEx = path.join(projectPath, "apps/backend/.env.example");
    const backendEnv = path.join(projectPath, "apps/backend/.env");
    if (fs.existsSync(backendEnvEx)) {
      fs.copyFileSync(backendEnvEx, backendEnv);
    }

    const starterEnvPath = path.join(projectPath, "apps/starter/.env");
    fs.writeFileSync(
      starterEnvPath,
      "# Backend Connection Mode\nVITE_ENABLE_MOCK=false\nVITE_API_BASE_URL=http://localhost:3333\n",
    );
  }

  if (fs.existsSync(rootPkgPath)) {
    fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + "\n");
  }

  // Initialize fresh git repository
  try {
    execSync("git init", { cwd: projectPath, stdio: "ignore" });
  } catch {}

  s.stop("Configuration complete!");

  // 5. Output next steps banner
  const cdCmd =
    targetDir === "." || targetDir === "./" ? "" : `cd ${targetDir}\n  `;

  if (variant === "mock") {
    outro(
      `${pc.green("✨ Project scaffolded successfully!")}\n\n` +
        `Next steps:\n` +
        `  ${pc.cyan(`${cdCmd}bun install\n  bun run dev`)}\n\n` +
        `${pc.dim("Your admin is running with full in-memory mock authentication and data.")}`,
    );
  } else {
    outro(
      `${pc.green("✨ Fullstack project scaffolded successfully!")}\n\n` +
        `Next steps:\n` +
        `  ${pc.cyan(
          `${cdCmd}bun install\n  bun docker:up\n  bun db:migrate\n  bun db:seed\n  bun run dev`,
        )}\n\n` +
        `${pc.dim("Frontend: http://localhost:5173 | API: http://localhost:3333/api | Docs: http://localhost:3333/docs")}`,
    );
  }
}

main().catch((err) => {
  console.error(pc.red("Error creating project:"), err);
  process.exit(1);
});
