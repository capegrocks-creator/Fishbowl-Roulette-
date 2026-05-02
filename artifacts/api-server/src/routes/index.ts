import { Router, type IRouter } from "express";
import healthRouter from "./health";
import podcastRouter from "./podcast";
import subscribersRouter from "./subscribers";

const router: IRouter = Router();

router.use(healthRouter);
router.use(podcastRouter);
router.use(subscribersRouter);

export default router;
