import express from 'express'
const router = express.Router();

import storyRoutes from './story.routes.js';
import entryRoutes from './entry.routes.js';
import adminRoutes from './admin.routes.js';

import adminOnly from '../middlewares/adminOnly.js';

import {homePage, pageNotFound} from '../controllers/index.js';

// routes "/"
router.get("/", homePage );

// routes story, entry, admin
router.use("/story", storyRoutes);
router.use("/entry", entryRoutes);
router.use("/admin", adminOnly, adminRoutes);

router.all("/*", pageNotFound);

export default router;