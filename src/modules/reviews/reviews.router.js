import { Router } from "express";
import auth from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { addReview } from "./controller/review.js";
const router = Router();

router.post("/addReview", auth(), asyncHandler(addReview));

export default router;
