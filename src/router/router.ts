import { Router, Request, Response} from "express";
import controller from "../controllers/controller";
import { validateDataConfirm, validateDataUpload } from "../middleware/validation";

const router = Router();
router.post('/upload', validateDataUpload,controller.upload);
router.patch('/confirm', validateDataConfirm,controller.confirm);



export default router