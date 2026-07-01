import { Router } from "express";
import { registerUser, loginUser, logoutUser, changePassword, changeUserDetails } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxcount: 1
    }
]),registerUser);
router.route("/login").post(loginUser);
router .route("/logout").post(logoutUser);
router .route("/change-password").post(changePassword);
router .route("/change-user-detail").post(changeUserDetails);


export default router;