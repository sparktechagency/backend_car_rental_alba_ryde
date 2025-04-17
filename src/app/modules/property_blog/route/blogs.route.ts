import express from 'express';
import { getPropertyBlogsController } from '../controller/getPropertyBlog.controller';
import { addPropertyBlogController } from '../controller/addPropertyBlog.controller';
import { getLatestPropertyBlogsController } from '../controller/getLatestPropertyBlogs.controller';
import { getSinglePropertyBlogDataController } from '../controller/getSinglePropertyData.controller';
import { updatePropertyBlogController } from '../controller/updatePropertyBlog.controller';

const router = express.Router();

router.get('/get-property-blog-data', getPropertyBlogsController);
router.get(
  '/get-single-property-blog-data/:id',
  getSinglePropertyBlogDataController
);
router.post('/get-property-blog-data/latest', getLatestPropertyBlogsController);
router.post('/add-property-blog', addPropertyBlogController);

router.post('/update-property-blog', updatePropertyBlogController);

export const propertyBlogRouter = router;
