import { mock } from "bun:test";

function TestIcon() {
  return null;
}

const iconBarrel = await Bun.file(
  new URL("../packages/core/src/components/ui/icons.tsx", import.meta.url),
).text();

const iconModules = new Set(
  Array.from(iconBarrel.matchAll(/from "(~icons\/[^"]+)"/g), (match) =>
    match[1],
  ),
);

for (const iconModule of iconModules) {
  mock.module(iconModule, () => ({
    default: TestIcon,
  }));
}
