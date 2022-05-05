import express from "express";
import userRouter from "./routes/userRouter";
import applicationRouter from "./routes/applicationRouter";
import companyRouter from "./routes/companyRouter";
import skillRouter from "./routes/skillRouter";
import commentRouter from "./routes/commentRouter";
import scrapeRouter from "./routes/scrapeRouter";

const router = express.Router();
export default router;

router.use("/users", userRouter);
router.use("/applications", applicationRouter);
router.use("/companies", companyRouter);
router.use("/skills", skillRouter);
router.use("/comments", commentRouter);
router.use("/scrape", scrapeRouter);
