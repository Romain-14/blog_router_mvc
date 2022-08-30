import express from 'express'
const router = express.Router();

import storyRoutes from './story.routes.js';
import entryRoutes from './entry.routes.js';
import adminRoutes from './admin.routes.js';

import adminOnly from '../middlewares/adminOnly.js';

import pool from "../database/db.js";

// routes "/"
router.get("/", async (req,res,next)=>{   
    const [posts] = await pool.execute(`SELECT post.Id AS postID, Title, Contents, CreationTimestamp, FirstName, LastName, Author_Id  FROM post JOIN author ON author.Id = post.Author_Id`);
    res.render("layout", {template: "pages/home", posts: posts});
});

// routes story, entry, admin
router.use("/story", storyRoutes);
router.use("/entry", entryRoutes);
router.use("/admin", adminOnly, adminRoutes);

export default router;