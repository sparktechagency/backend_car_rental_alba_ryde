import axios from 'axios';
import { GOOGLE_MAP_API_KEY } from '../../data/environmentVariables';

export const getEstimatedDistanceAndTime = async (
  pickup_location_latitude: any,
  pickup_location_longitude: any,
  dropoff_location_latitude: any,
  dropoff_location_longitude: any
) => {
  const origins = `${pickup_location_latitude},${pickup_location_longitude}`;
  const destinations = `${dropoff_location_latitude},${dropoff_location_longitude}`;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${GOOGLE_MAP_API_KEY}`;
  const response = await axios.get(url, {
    params: {
      origins,
      destinations,
      key: GOOGLE_MAP_API_KEY,
      mode: 'driving', // optional, can be driving, walking, bicycling, transit
    },
  });

  let myData = response.data.rows[0].elements[0] as any;

  if (myData.status === 'NOT_FOUND') {
    myData = null;
    return myData;
  }
  myData = {
    distance: {
      kilometer: parseFloat(myData.distance.text),
      meter: myData.distance.value,
    },
    time: {
      minute: parseFloat(myData.duration.text),
      second: myData.duration.value,
    },
  };

  return myData;
};
