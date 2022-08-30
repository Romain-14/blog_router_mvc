import express from 'express';
const router = express.Router();

import bcrypt from 'bcrypt';

import pool from "../database/db.js";

router.get("/signout", (req,res,next)=>{
    console.log("destroy");
    req.session.destroy();
    res.redirect("/");
});

router.get("/:signup?", (req,res,next) =>{
    console.log("req //////", req.url)
    res.render("layout", {template: "pages/user/entry", typeform: !req.params.signup ? "signin" : "signup" });
});

router.post("/signup", async (req,res,next)=>{
    const saltrounds = 10;
    const {email, password} = req.body;
    const [user] = await pool.execute(`SELECT * from user WHERE Email= ?`, [email]);
    console.log(user)
    if(!user[0]){
        const hash = await bcrypt.hash(password, saltrounds);
        const [userSave] = await pool.execute(`INSERT INTO user (Email, Password, Role) VALUE(?,?,"user")`, [email, hash]);
        console.log(userSave);
        res.redirect("/entry");
    } else {
        res.json({
            msg:"Cet utilisateur existe déjà !!"
        })
    }
});

router.post("/signin", async (req, res, next)=>{
    const {email, password} = req.body;
    const [user] = await pool.execute(`SELECT * FROM user WHERE Email = ?`, [email]);

    const isSamePwd = user[0] ? await bcrypt.compare(password, user[0].Password) : null; 
    
    if(!user[0] || !isSamePwd) {
        res.locals.error = "Bad Email or/and Password";

        res.render("layout", {template: "user/entry", typeform: !req.params.signup ? "signin" : "signup"});

    } else { 
        req.session.user = {email: email, role: user[0].Role};
        req.session.isLogged = true;
        res.redirect('/');
    }

});


export default router