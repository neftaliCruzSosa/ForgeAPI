import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import forgeAPI, { updateModels } from "./index.js";

import type {
  LoadConfigOptions,
  EntityDefinition,
  UpdateModelsOptions,
} from "types";

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: "http://localhost:8888" }));
app.use(express.json({ limit: "2mb" }));

const asyncHandler =
  <P extends any[], R>(fn: (...args: P) => Promise<R>) =>
  (...args: P) =>
    fn(...args).catch(args[2] as any);

app.get(
  "/v1/projects",
  asyncHandler(async (_req, res) => {
    const projects = await prisma.proyect.findMany({
      include: {
        entities: {
          include: { fields: true, protect: true },
        },
      },
    });
    res.json(projects);
  })
);

app.get(
  "/v1/projects/:name",
  asyncHandler(async (req, res) => {
    const { name } = req.params;

    const project = await prisma.proyect.findFirst({
      where: { name: { equals: name } },
      include: {
        entities: {
          include: { fields: true, protect: true },
        },
      },
    });

    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  })
);

app.post(
  "/v1/projects",
  asyncHandler(async (req, res) => {
    const body = req.body as LoadConfigOptions & { entities: EntityDefinition[] };

    if (!body?.projectName) {
      return res.status(400).json({ error: 'Missing "projectName"' });
    }
    if (!Array.isArray(body?.entities)) {
      return res.status(400).json({ error: 'Missing or invalid "entities" array' });
    }

    await forgeAPI(body);

    res.status(201).json({
      ok: true,
      message: `Project "${body.projectName}" generated successfully.`,
    });
  })
);

app.post(
  "/v1/projects/:projectName/models",
  asyncHandler(async (req, res) => {
    const { projectName } = req.params;
    const { changes } = req.body as Pick<UpdateModelsOptions, "changes">;

    if (!projectName) return res.status(400).json({ error: "Missing projectName in URL" });
    if (!changes || !Array.isArray(changes)) {
      return res.status(400).json({ error: 'Missing or invalid "changes" array' });
    }

    await updateModels({ projectName, changes });

    res.status(200).json({
      ok: true,
      message: `Models updated for "${projectName}".`,
    });
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err?.statusCode ?? 500;
  const msg = err?.message ?? "Internal Server Error";
  console.error("API error:", err);
  res.status(status).json({ ok: false, error: msg });
});

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => {
  console.log(`ForgeAPI backend listening on http://localhost:${PORT}`);
});
