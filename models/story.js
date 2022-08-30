import pool from "../database/db.js";

class Story {

    static async getData(query){
        const [datas] = await pool.execute(query);
        return datas;
    }


    

}

export default Story;