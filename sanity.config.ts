import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

// Project id/dataset are public values. Hardcoded fallbacks let the standalone
// Studio (run via the Sanity CLI) work — the CLI doesn't expose NEXT_PUBLIC_
// vars to the Studio bundle, only SANITY_STUDIO_-prefixed ones.
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  "7okuxdmh";
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";

export default defineConfig({
  name: "watch-store",
  title: "OLEVS",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
