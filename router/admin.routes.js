import express from 'express';
const router = express.Router();

import pool from "../database/db.js";

router.get("/", async (req,res,next)=>{
    const [stories] = await pool.execute(`SELECT post.Id AS postID, category.Name AS category_title, author.Id, Author_Id, Title, Contents, CreationTimestamp, FirstName, LastName FROM post JOIN author ON author.Id = post.Author_Id JOIN category ON category.Id = post.Category_Id`);

    res.render("layout", {template:"pages/admin/admin", stories:stories})
});

router.get("/story/add", async(req,res,next)=>{
    const [categories] = await pool.execute(`SELECT Id, Name FROM category`);
    const [authors] = await pool.execute(`SELECT Id, FirstName, LastName FROM author`);

    res.render("layout", {template: "pages/admin/story/add", categories: categories, authors:authors});
});

router.post("/story/add", async (req,res,next)=>{
    try {
        console.log(req.body);
        const {title, story, author, category} = req.body;
        const [result] = await pool.execute(`INSERT INTO post (Title,Contents, CreationTimestamp, Author_Id, Category_Id) VALUES (?, ?, NOW(), ?, ?)`, [title, story, author, category]);

        if(result.affectedRows){
            res.redirect("/admin")
        }
    } catch (error) {
        console.log(error)
    }
});

router.get("/story/edit/:postID", async (req,res,next)=>{
    const [story] = await pool.execute("SELECT post.Id AS postID, Title, Contents FROM post WHERE post.Id = ?", [req.params.postID]);    
    res.render("layout", {template: "pages/admin/story/edit", story: story[0]})
});

router.post("/story/edit/:postID",  async (req,res,next)=> {
    try {
        const {title, story} = req.body;
        const [result] = await pool.execute(`UPDATE post SET Title = ?, Contents = ? WHERE Id = ?`, [title, story, req.params.postID]);
        console.log(result);
        res.redirect("/admin");
    } catch (error) {
        console.log(error);
    }
});

router.get("/story/delete/:postID", async (req,res,next)=>{
    try {
        const [result] = await pool.execute("DELETE FROM post WHERE Id = ? ", [req.params.postID]);
        console.log(result)
        res.redirect("/admin");
    } catch (error) {
        console.log(error)
    }
});


export default router;