import express from 'express';
import { createAssetController } from '../controller/createAsset.controller';
import { deleteAssetController } from '../controller/deleteAsset.controller';

const assetRoutes = express.Router();

assetRoutes.post('/create', createAssetController);
assetRoutes.post('/delete-asset', deleteAssetController);

export { assetRoutes };
