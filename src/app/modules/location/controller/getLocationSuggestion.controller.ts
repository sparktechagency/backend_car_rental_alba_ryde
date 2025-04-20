import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import axios from 'axios';
import { GOOGLE_MAP_API_KEY } from '../../../../data/environmentVariables';

export const getLocationSuggestionController = myControllerHandler(
  async (req, res) => {
    const { searchText } = req.body;
    const googleResponse = await axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          input: searchText,
          key: GOOGLE_MAP_API_KEY,
        },
      }
    );

    const myPredictions = googleResponse.data.predictions;
    const arrayOfSuggestions = [] as any;

    for (let i = 0; i < myPredictions.length; i++) {
      const singleData = myPredictions[i];
      arrayOfSuggestions.push(singleData.description);
    }

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: arrayOfSuggestions,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
