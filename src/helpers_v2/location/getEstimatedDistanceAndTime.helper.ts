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
export const getEstimatedDistanceAndTimeWithPolyline = async (
  pickup_location_latitude: any,
  pickup_location_longitude: any,
  dropoff_location_latitude: any,
  dropoff_location_longitude: any
) => {
  const origin = `${pickup_location_latitude},${pickup_location_longitude}`;
  const destination = `${dropoff_location_latitude},${dropoff_location_longitude}`;

  const url = `https://maps.googleapis.com/maps/api/directions/json`;

  const response = await axios.get(url, {
    params: {
      origin,
      destination,
      key: GOOGLE_MAP_API_KEY,
      mode: 'driving', // optional: driving, walking, bicycling, transit
      alternatives: false, // you can set true if you want multiple routes
    },
  });

  if (response.data.status !== 'OK' || response.data.routes.length === 0) {
    return null; // no route found
  }

  const route = response.data.routes[0];
  const leg = route.legs[0];

  const distanceText = leg.distance.text; // e.g., "5.2 km"
  const distanceValue = leg.distance.value; // in meters

  const durationText = leg.duration.text; // e.g., "12 mins"
  const durationValue = leg.duration.value; // in seconds

  const polyline = route.overview_polyline
    ? route.overview_polyline.points
    : null;

  return {
    distance: {
      kilometer: parseFloat(distanceText.replace(/[^\d.]/g, '')), // remove non-numeric except dot
      meter: distanceValue,
    },
    time: {
      minute: parseFloat(durationText.replace(/[^\d.]/g, '')), // remove non-numeric except dot
      second: durationValue,
    },
    polyline, // encoded polyline string for route drawing
  };
};
