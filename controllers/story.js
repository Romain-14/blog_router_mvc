import Story from "../models/story.js";

// créer deux fonctions:
// - une qui va afficher la page story/:id
// - une qui va gérer l'ajout de commentaires
// utilisation de méthode dans la class Story du dossier model

export const oneStory =  async(req, res, next) => {
    // stockage dans un objet qu'on transmettra dans la méthode du model du paramètre ID (l'article) plus les queries
    const datas = {
        id: req.params.id,
        query1: "SELECT Post.Id AS postID, Title, Contents, FirstName, LastName FROM post JOIN author ON author.Id = post.Author_Id WHERE Post.Id = ?",
        query2 : "SELECT NickName, Contents, CreationTimestamp FROM comment WHERE Post_Id = ? ORDER BY CreationTimestamp DESC",
    }

    try {
        // invocation de la méthode du model, on transmets l'objet
        const result = await Story.getOneStoryAndComment(datas);
        // si rien n'est trouvé (ça ne devrait pas être le cas !!), on redirige vers une page d'erreur
        if(!result[0].length){
            res.json({
                msg: "not found",
            })
        }else { // sinon pas d'erreur on affiche le rendu, attention à la manipulation du tableau ( [[], []] )
            res.render('layout', {template: "pages/story", post: result[0][0], comments: result[1]});
        }
    } catch (error) {
        console.log(error)
    }
}

export const addComment = async (req,res,next) =>{
    const datas = {
        nickName: req.body.alias,
        contents: req.body.comm,
        id: req.params.postID,
    }
    const query = `INSERT INTO comment (NickName, Contents, CreationTimestamp, Post_Id) VALUES( ?, ?, NOW(), ?)`;
    try {
        await Story.save(query, datas);
        res.redirect(`/story/${req.params.postID}`);
    } catch (error) {
        console.log(error)
    }
}