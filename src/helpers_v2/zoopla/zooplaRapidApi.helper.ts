import axios from 'axios';
import {
  ZOOPLA_RAPID_API_BASE_URL,
  ZOOPLA_RAPID_API_HOST,
  ZOOPLA_RAPID_API_KEY,
} from '../../data/environmentVariables';

export const zooplaRapidApiAR7 = (geoIdentifier: string, geoLabel: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${ZOOPLA_RAPID_API_BASE_URL}/properties/search-sale`,
        {
          params: {
            geoIdentifier: geoIdentifier,
            geoLabel: geoLabel,
            beds_min: 5,
          },
          headers: {
            'x-rapidapi-host': ZOOPLA_RAPID_API_HOST,
            'x-rapidapi-key': `${ZOOPLA_RAPID_API_KEY}`,
          },
        }
      );
      const propertyData = response.data.data.listings;
      resolve(propertyData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
export const zooplaRapidApiAR7_2 = (locationData: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(locationData);
      const { location, price_min, price_max, beds_min } = locationData;
      const response = await axios.get(
        `${ZOOPLA_RAPID_API_BASE_URL}/properties/search-sale`,
        {
          params: {
            geoIdentifier: location,
            geoLabel: location,
            beds_min: beds_min,
            price_min: price_min,
            price_max: price_max,
          },
          headers: {
            'x-rapidapi-host': ZOOPLA_RAPID_API_HOST,
            'x-rapidapi-key': `${ZOOPLA_RAPID_API_KEY}`,
          },
        }
      );
      let propertyData = response.data.data.listings;
      propertyData = [...propertyData.regular, ...propertyData.featured];

      resolve(propertyData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
