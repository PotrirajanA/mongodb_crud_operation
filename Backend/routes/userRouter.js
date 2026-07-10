import express from "express"
import { addUsers, deleteUser, getAllUser, getSingleUser, updateUser } from "../controller/userController.js";

const router = express.Router();

router.route("/").get(getAllUser).post(addUsers);
router.route("/:id").put(updateUser).delete(deleteUser).get(getSingleUser);




export default router;