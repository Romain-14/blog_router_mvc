import Story from "../models/story.js";

export const homePage = async (req, res, next) => {

    const query = "SELECT post.Id AS postID, Title, Contents, CreationTimestamp, FirstName, LastName, Author_Id  FROM post JOIN author ON author.Id = post.Author_Id";
    try {
        const posts = await Story.getData(query);
        console.log(posts);
    
        res.render("layout", {template: "pages/home", posts: posts});
        
    } catch (error) {
        console.log(error);
        // effectuer une redirection vers une page indiquant qu'il y un problème avec la base de données
    }
}

export const pageNotFound = (req, res, next) => {
    res.json({
        msg: "not found"
    })
}