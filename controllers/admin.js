import Story from "../models/story.js";

// la méthode ici sera d'affecter à une variable la query string pour effectuer la requête SQL coté model
// on peut aussi stocker dans un objet les données post/ param pour exploiter ça avec un spread dans une méthode qui pourra être utiliser pour différentes actions notamment la méthode "Story.save()"

export const adminPage = async (req, res) => {
    const query = `SELECT post.Id AS postID, category.Name AS category_title, author.Id, Author_Id, Title, Contents, CreationTimestamp, FirstName, LastName FROM post JOIN author ON author.Id = post.Author_Id JOIN category ON category.Id = post.Category_Id`;
    try {
        const stories = await Story.getData(query);
        res.render("layout", {template:"pages/admin/admin", stories:stories})
    } catch (error) {
        console.log(error)
    }
}

export const storyPage = async (req, res) => {
    const query1 = `SELECT Id, Name FROM category`;
    const query2 = `SELECT Id, FirstName, LastName FROM author`;
    try {
        const categories = await Story.getData(query1);
        const authors    = await Story.getData(query2);
        res.render("layout", {template: "pages/admin/story/add", categories: categories, authors: authors});
    } catch (error) {
        console.log(error)
    }
}

export const addStory = async(req,res)=>{
    const {title, story, author, category} = req.body;
    const datas = {
        title: title,
        content: story,
        author: author,
        category: category,
    }
    const query = `INSERT INTO post (Title, Contents, CreationTimestamp, Author_Id, Category_Id) VALUES (?, ?, NOW(), ?, ?)`;
    try {
        await Story.save(query, datas);
        res.redirect("/admin");
    } catch (error) {
        console.log(error)
    }
}

export const editPage =  async (req,res)=>{
    const query = `SELECT post.Id AS postID, Title, Contents FROM post WHERE post.Id = ?`;
    try {
        const [story] = await Story.getDataWithValue(query, req.params.postID); 
        res.render("layout", {template: "pages/admin/story/edit", story: story})
    } catch (error) {
        console.log(error);
    } 
}

export const editStory = async (req,res) => {
    const {title, story} = req.body;
    const datas = {
        title: title,
        content: story,
        id: req.params.postID,
    }
    try {
        const query = `UPDATE post SET Title = ?, Contents = ? WHERE Id = ?`;
        await Story.save(query, datas);
        res.redirect("/admin");
    } catch (error) {
        console.log(error);
    }
}

export const deleteStory = async (req,res,next)=>{
        try {
            const query = "DELETE FROM post WHERE Id = ? ";
            await Story.delete(query, req.params.postID);
            res.redirect("/admin");
        } catch (error) {
            console.log(error)
        }
    }