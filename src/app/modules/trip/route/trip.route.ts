import express from 'express';
import { makeTripRequestController } from '../controller/makeTripRequest.controller';
import { getAvailableCarListAndPriceController } from '../controller/getAvailableCarListAndPrice.controller';
import { requestForTripController } from '../controller/requestForTrip.controller';
import { getIncomingTripRequestController } from '../controller/getIncomingTripRequest.controller';
import { populateTripRequestController } from '../controller/populatePendingTripRequests.controller';
import { acceptTripRequestController } from '../controller/acceptTripRequest.controller';
import { rejectTripController } from '../controller/rejectTrip.controller';
import { bookTripController } from '../controller/bookTrip.controller';
import { getAvailableCarsToBookController } from '../controller/getAvailableCarsToBook.controller';
import { getEstimatedDistanceAndDropOffTimeController } from '../controller/getEstimatedDistanceAndDropOfftime.controller';
import { requestTripBookingController } from '../controller/requestTripBooking.controller';
import { getIncomingBookingRequestController } from '../controller/getIncomingBookingRequest.controller';
import { populateIncomingBookingRequestController } from '../controller/populateIncomingBookingRequest.controller';
import { acceptBookingRequestController } from '../controller/acceptBookingRequest.controller';
import { getBookedTripController } from '../controller/getBookedTrip.controller';
import { changeCarTypeOfTripController } from '../controller/changeCarTypeOfTrip.controller';
import { requestForBookingController2 } from '../controller/requestForBooking2.controller';
import { getOwnPendingBookingsController } from '../controller/getOwnPendingTrips.controller';
import { changeOwnCarModelController } from '../controller/changeOwnCarModel.controller';
import { markTripCompletedByUserController } from '../controller/markATripCompletedByUser.controller';
import { getOwnConfirmedBookedTripsController } from '../controller/getOwnBookedBookings.controller';
import { getOwnCompletedBookingsController } from '../controller/getOwnCompletedBookings.controller';
import { getOwnCompletedBookingsOfDriverController } from '../controller/getOwnCompletedBookingsOfDriver.controller';
import { cancelTripBookingsController } from '../controller/cancelBooking.controller';
import { getOwnCancelledBookingTripsController } from '../controller/getOwnCancelledBookingsTrip.controller';

const router = express.Router();

router.post('/request/make', makeTripRequestController);
router.get(
  '/available-cars-with-price/list',
  getAvailableCarListAndPriceController
);
router.post('/request-trip', requestForTripController);
router.get('/incoming-request', getIncomingTripRequestController);
router.post('/populate-trip-request', populateTripRequestController);
router.post('/accept-trip-request', acceptTripRequestController);
router.post('/reject-trip-request', rejectTripController);
router.post('/get-available-cars-to-book', getAvailableCarsToBookController);
router.post('/book', bookTripController);
router.post(
  '/get-estimated-distance-and-dropoff-time',
  getEstimatedDistanceAndDropOffTimeController
);
router.post('/request-trip-booking', requestForBookingController2);
router.get('/get-own-pending-bookings', getOwnPendingBookingsController);
router.get(
  '/get-own-confirmed-booked-trips',
  getOwnConfirmedBookedTripsController
);
router.get('/incoming-booking-request', getIncomingBookingRequestController);
router.post(
  '/populate-incoming-booking-request',
  populateIncomingBookingRequestController
);
router.post('/accept-booking-request', acceptBookingRequestController);
router.get('/get-booked-trip', getBookedTripController);
router.post('/change-car-type-of-trip', changeCarTypeOfTripController);
router.post('/change-own-car-model', changeOwnCarModelController);
router.post('/mark-trip-completed-by-user', markTripCompletedByUserController);
router.get('/get-own-completed-bookings', getOwnCompletedBookingsController);
router.get(
  '/get-own-completed-bookings-of-driver',
  getOwnCompletedBookingsOfDriverController
);
router.post('/cancel-trip-booking', cancelTripBookingsController);
router.get(
  '/get-own-cancelled-booked-trips',
  getOwnCancelledBookingTripsController
);

export const tripRouter = router;
