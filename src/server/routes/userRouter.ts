import express from "express";
import user from "../models/userModel";
const router = express.Router();

/* GET programming languages. */
router.get("/", async function (req, res, next) {
    try {
        const rows = await user.getAll();
        res.send(rows);
    } catch (err) {
        console.error(`Error in user.getAll(): ${err}`);
        next(err);
        // res.status(500).send(null);
    }
});

export default router;
