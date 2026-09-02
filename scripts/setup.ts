import {
  intro,
  outro,
  select,
  confirm,
  spinner,
  isCancel,
  cancel,
} from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

async function main() {
  console.clear();
  intro(pc.bgCyan(pc.black(" Z3 Admin Setup Wizard ")));

  const mode = await select({
    message: "Select your project mode:",
    options: [
      {
        value: "mock",
        label: "🎨 Frontend Only with Mock Data",
        hint: "Run immediately without Docker or PostgreSQL",
      },
      {
        value: "fullstack",
        label: "⚡ Fullstack (Express Backend + PostgreSQL + Drizzle ORM)",
        hint: "Start database, apply migrations, seed initial users",
      },
      {
        value: "strip-backend",
        label: "✂️ Pure Frontend (Permanently delete backend & Docker files)",
        hint: "Converts repository into a lightweight standalone frontend monorepo",
      },
    ],
  });

  if (isCancel(mode)) {
    cancel("Setup cancelled.");
    process.exit(0);
  }

  const s = spinner();

  if (mode === "mock") {
    s.start("Configuring Mock Data environment...");
    fs.writeFileSync(
      path.resolve("apps/starter/.env"),
      "# Mock Data Mode (In-memory CRUD handlers)\nVITE_ENABLE_MOCK=true\n",
    );
    s.stop("Mock environment configured.");

    outro(
      `${pc.green("All set!")}\n\n` +
        `Start frontend with mock data:\n` +
        `  ${pc.cyan("bun run dev:mock")}\n`,
    );
    return;
  }

  if (mode === "fullstack") {
    s.start("Configuring Fullstack environment...");

    const backendEnvEx = path.resolve("apps/backend/.env.example");
    const backendEnv = path.resolve("apps/backend/.env");
    if (!fs.existsSync(backendEnv) && fs.existsSync(backendEnvEx)) {
      fs.copyFileSync(backendEnvEx, backendEnv);
    }

    fs.writeFileSync(
      path.resolve("apps/starter/.env"),
      "# Backend Connection Mode\nVITE_ENABLE_MOCK=false\nVITE_API_BASE_URL=http://localhost:3333\n",
    );
    s.stop("Environment files configured.");

    const runDocker = await confirm({
      message: "Do you want to start PostgreSQL and seed default accounts now?",
      initialValue: true,
    });

    if (isCancel(runDocker)) {
      cancel("Setup cancelled.");
      process.exit(0);
    }

    if (runDocker) {
      try {
        s.start("Starting PostgreSQL container...");
        execSync("docker compose up -d", { stdio: "ignore" });
        s.stop("PostgreSQL running.");

        s.start("Applying database migrations...");
        execSync("bun --cwd apps/backend db:migrate", { stdio: "ignore" });
        s.stop("Migrations applied.");

        s.start("Seeding initial accounts (superadmin, admin, user)...");
        execSync("bun --cwd apps/backend db:seed", { stdio: "ignore" });
        s.stop("Accounts seeded.");
      } catch (err) {
        s.stop("Database setup failed.");
        console.error(pc.yellow("Note: Make sure Docker is running on your machine."));
      }
    }

    outro(
      `${pc.green("All set!")}\n\n` +
        `Start fullstack applications:\n` +
        `  ${pc.cyan("bun run dev")}\n\n` +
        `${pc.dim("Credentials: superadmin@example.com / admin@example.com / user@example.com (pw: 12345678)")}`,
    );
    return;
  }

  if (mode === "strip-backend") {
    const shouldDelete = await confirm({
      message:
        "Are you sure you want to permanently delete apps/backend and docker-compose.yml?",
      initialValue: false,
    });

    if (isCancel(shouldDelete) || !shouldDelete) {
      cancel("Operation cancelled.");
      process.exit(0);
    }

    s.start("Removing backend files...");
    fs.rmSync(path.resolve("apps/backend"), { recursive: true, force: true });
    if (fs.existsSync(path.resolve("docker-compose.yml"))) {
      fs.rmSync(path.resolve("docker-compose.yml"), { force: true });
    }

    fs.writeFileSync(
      path.resolve("apps/starter/.env"),
      "# Mock Data Mode (In-memory CRUD handlers)\nVITE_ENABLE_MOCK=true\n",
    );

    const rootPkgPath = path.resolve("package.json");
    if (fs.existsSync(rootPkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf-8"));
      if (pkg.scripts) {
        delete pkg.scripts["db:migrate"];
        delete pkg.scripts["db:push"];
        delete pkg.scripts["db:reset"];
        delete pkg.scripts["db:seed"];
        delete pkg.scripts["docker:up"];
        delete pkg.scripts["docker:down"];
        delete pkg.scripts["dev:backend"];
        delete pkg.scripts["dev:full"];
      }
      fs.writeFileSync(rootPkgPath, JSON.stringify(pkg, null, 2) + "\n");
    }

    s.stop("Backend removed.");

    outro(
      `${pc.green("Cleaned!")}\n\n` +
        `Run your standalone frontend:\n` +
        `  ${pc.cyan("bun run dev:mock")}\n`,
    );
  }
}

main().catch(console.error);
