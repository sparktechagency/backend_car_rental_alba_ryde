import express from 'express';
import { getHomepageDataController } from '../controller/getHomePageData.controller';

const homeRouter = express.Router();

homeRouter.get('/', getHomepageDataController);

export { homeRouter };
