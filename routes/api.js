import {Router} from "express"
import AuthController from "../controllers/AuthController.js";
import PatientController from "../controllers/PatientController.js";
import authMiddleware from "../middleware/Authenticate.js";

const router = Router();

router.post("/auth/register", AuthController.register)
router.post("/auth/login", AuthController.login)

//patient routes
router.post("/patient", authMiddleware, PatientController.newPatient);
router.post("/existing/patient", authMiddleware, PatientController.existingPatient);
router.get("/patient", authMiddleware, PatientController.show);
router.get("/patients", authMiddleware, PatientController.showAll);
router.get("/patients/recent", authMiddleware, PatientController.recentPatients)

export default router;