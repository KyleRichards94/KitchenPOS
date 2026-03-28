import "dotenv/config";
import cors from "cors";
import express from "express";
import { authenticateRouter } from "./routers/authenticate.router.js";
import { usersRouter } from "./routers/users.router.js";
import { tagsRouter, tagTypesRouter } from "./routers/tags.router.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// ---------------------------------------------------------------------------
// Health (for frontend / load balancers)
// ---------------------------------------------------------------------------

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// Routers
// ---------------------------------------------------------------------------

app.use("/auth", authenticateRouter);
app.use("/users", usersRouter);
app.use("/tagtypes", tagTypesRouter);
app.use("/tags", tagsRouter);

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
);

// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
