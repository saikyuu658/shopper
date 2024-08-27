import { Router, Request, Response} from "express";
import controller from "../controllers/controller";
import { validateData } from "../middleware/validation";

const router = Router();
router.post('/upload', validateData,controller.upload);



export default router