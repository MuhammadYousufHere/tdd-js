import express from "express";
import * as articleController from "./article-handlers";
import authenticateToken from "../../middleware/auth-middleware";
import { validateBody } from "../../middleware/validator-middleware";
import { articleCreateSchema, articlePatchSchema } from "./article-validators";

const router = express.Router();

router.get("/", articleController.getAll());
router.post(
  "/",
  authenticateToken(),
  validateBody(articleCreateSchema),
  articleController.create()
);
router.get("/:id", articleController.getOne());
router.patch(
  "/:id",
  validateBody(articlePatchSchema),
  authenticateToken(),
  articleController.patch()
);
router.delete("/:id", authenticateToken(), articleController.remove());

export default router;
