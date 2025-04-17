import { StatusCodes } from 'http-status-codes';
import axios from 'axios';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { ZOOPLA_API_KEY } from '../../../../data/environmentVariables';

export const getPropertyDataFromZooplaController = myControllerHandler(
  async (req, res) => {
    try {
      const zooplaApiUrl =
        'https://api.zoopla.co.uk/api/v1/property_listings.json';

      // Make sure you're using the correct query parameters
      const response = await axios.get(zooplaApiUrl, {
        headers: {
          Authorization: `Bearer ${ZOOPLA_API_KEY}`,
        },
        params: {
          api_key: ZOOPLA_API_KEY,
          area: 'London', // Replace with dynamic value if needed
          page_size: 10, // Adjust the page size if necessary
        },
      });

      // Send the data back to the client
      const myResponse = {
        message: 'Property data fetched successfully',
        success: true,
        data: response.data, // This contains the property data
      };

      res.status(StatusCodes.OK).json(myResponse);
    } catch (error) {
      // Handle errors gracefully
      console.error('Error fetching data from Zoopla:', error.message);

      const myResponse = {
        message: 'Failed to fetch property data',
        success: false,
        error: error.message,
      };

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(myResponse);
    }
  }
);
