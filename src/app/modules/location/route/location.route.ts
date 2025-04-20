import express from 'express';
import { addLocationController } from '../controller/addLocation.controller';
import { populateLocationController } from '../controller/populateLocation.controller';
import { removeLocationFromUserController } from '../controller/removeLocationFromEveryUser.controller';
import { getLocationSuggestionController } from '../controller/getLocationSuggestion.controller';

const router = express.Router();

router.post('/add-location', addLocationController);
router.post('/populate-location', populateLocationController);
router.post('/remove-location-from-user', removeLocationFromUserController);
router.post('/get-location-suggestion', getLocationSuggestionController);

export const locationRouter = router;
