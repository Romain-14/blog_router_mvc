import express from 'express';
const router = express.Router();

import pool from "../database/db.js";

// ici on est sur l'url http://localhost:9000/story
router.get("/:id", async (req, res, next)=>{
    const [post] = await pool.execute(`SELECT Post.Id AS postID, Title, Contents, FirstName, LastName FROM post JOIN author ON author.Id = post.Author_Id`);

    const [comments] = await pool.execute(`SELECT NickName, Contents, CreationTimestamp FROM comment WHERE Post_Id = ? ORDER BY CreationTimestamp DESC`, [req.params.id]);

    res.render('layout', {template: "pages/story", post: post[0], comments: comments});
});

router.post("/add_comment/:postID", async (req,res,next)=>{
    const [result] = await pool.execute(`INSERT INTO comment (NickName, Contents, CreationTimestamp, Post_Id) VALUES( ?, ?, NOW(), ?) `, [req.body.alias, req.body.comm, req.params.postID]);
    res.redirect(`/story/${req.params.postID}`);
});

export default router;