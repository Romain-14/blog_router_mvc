import pool from "../database/db.js";

class Story {

    static async getData(query){
        const [datas] = await pool.execute(query);
        return datas;
    }
    
    static async getDataWithValue(query, id){
        const [datas] = await pool.execute(query, [id]);
        return datas;
    }    

    static async getOneStoryAndComment({id, query1, query2}){ // on destructure notre objet directement
        // et on effectue nos requêtes
        // la 1ère qui correspond à la récupération de l'article
        const [res1] = await pool.execute(query1, [id]);
        // la 2ème qui correspond à la récupération des commentaires lié à cet article
        const [res2] = await pool.execute(query2, [id]);
        // on envoi les réponses de la BDD dans un tableau donc [[res1], [res2]]
        return [res1, res2];
    }   

    // cette méthode permets d'ajouter ou de modifier un élément d'une table (Create, Update)
    static async save(query, datas){
        // on spread les values(uniquement) de mon objet dans le tableau de "bind parameters" de la requêtes sql
        const [result] = await pool.execute(query, [...Object.values(datas)]);
        return result;
    }

    static async delete(query, id){
        const [result] = await pool.execute(query, [id]);
        return result;
    }

}

export default Story;