import express from "express"
import isLogin from "../middleware/isLogin.js";
import { getCurrentChatters, getUserBySearch } from "../routeControllers/userhandlerController.js";

const router=express.Router();

router.get("/search",isLogin,getUserBySearch)
router.get("/currentChatters",isLogin,getCurrentChatters)


export default router;