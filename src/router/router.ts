import { Router } from "express";
import controller from "../controllers/controller";
import { validateDataConfirm, validateDataList, validateDataUpload } from "../middleware/validation";

const router = Router();
router.get('/:customerCode/list',validateDataList, controller.list);
router.get('/:image',controller.getImage);
router.post('/upload', validateDataUpload,controller.upload);
router.patch('/confirm', validateDataConfirm,controller.confirm);



export default router