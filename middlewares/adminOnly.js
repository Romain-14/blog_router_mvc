// on export default une fonction anonyme en guise de middleware pour l'authentification de la route en tant qu'admin et pouvoir continuer dessus
export default (req, res, next)=>{
    if(req.session.user?.role === "admin"){
        next();
    } else {
        res.redirect("/");
    }
}