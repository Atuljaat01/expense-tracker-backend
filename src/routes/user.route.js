import { signUp, signIn, changePassword, updateUserProfile, signOut, getUserProfile, deleteUser, getUserSubscription } from "../controllers/user.controller.js";
import express, { Router} from "express";
import verifyJwt from "../middleware/auth.middleware.js";

const router = Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/signout").post(verifyJwt, signOut);
router.route("/change-password").post(verifyJwt, changePassword)
router.route("/update-profile").put(verifyJwt, updateUserProfile);
router.route("/profile").get(verifyJwt, getUserProfile);
router.route("/delete-user").delete(verifyJwt, deleteUser);
router.route("/subscription").get(verifyJwt, getUserSubscription);






export default router;
