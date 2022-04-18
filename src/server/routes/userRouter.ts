import express from "express";
import * as user from "../models/userModel";
const router = express.Router();

router.get("/", async function (req, res, next) {
    try {
        const rows = await user.getAll();
        res.send(rows);
    } catch (err) {
        console.error(`Error in user.getAll(): ${err}`);
        next(err);
    }
});

export default router;
