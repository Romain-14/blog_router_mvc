import express from 'express';
const router = express.Router();

import {oneStory, addComment} from '../controllers/story.js'


// ici on est sur l'url http://localhost:9000/story

router.get("/:id", oneStory);

router.post("/add_comment/:postID", addComment);


export default router;