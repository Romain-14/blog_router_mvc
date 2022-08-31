import express from 'express';
import { adminPage, storyPage, addStory, editPage, editStory,deleteStory } from '../controllers/admin.js';
const router = express.Router();

router.get("/", adminPage);

router.get("/story/add", storyPage);
router.post("/story/add", addStory);

router.get("/story/edit/:postID", editPage);
router.post("/story/edit/:postID", editStory);

router.get("/story/delete/:postID", deleteStory);

export default router;