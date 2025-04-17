import express from 'express';
import { getCategoriesController } from '../controller/getCategories.controller';
import { addCategoryController } from '../../admin-v2/controller/addCategories.controller';
import { getSingleCategoryController } from '../controller/getSingleCategory.controller';

const categoriesRouter = express.Router();

categoriesRouter.get('/', getCategoriesController);
categoriesRouter.get('/:id', getSingleCategoryController);

export { categoriesRouter };
