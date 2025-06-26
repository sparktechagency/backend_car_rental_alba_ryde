import express from 'express';
import { getAdminDashboardDataController } from '../controller/getDashboardData.controller';
import { getUserDataController } from '../controller/getUsersData.controller';
import { banUserController } from '../controller/banUser.controller';
import { getReviewsDataForAdminController } from '../controller/getReviewsData.controller';
import { adminSignInController } from '../controller/signIn.controller';
import { adminForgotPasswordController } from '../controller/forgotPassword.controller';
import { verifyForgotPasswordOtpController } from '../controller/verifyForgotPasswordOtp.controller';
import { changeAdminPasswordController } from '../controller/changePasswordOfAdmin.controller';
import { removeProductController } from '../controller/removeProduct.controller';
import { changePasswordController2 } from '../controller/changePassword2.controller';
import { getTotalNumberOfUserController } from '../controller/getTotalNumberOfUser.controller';
import { getTotalAmountOfEarningsController } from '../controller/getTotalAmountOfEarnings.controller';
import { getIncomeOfDifferentMonthsController } from '../controller/getIncomeOfDifferentTime.controller';
import { getUserRatioOfDifferentMonthsController } from '../controller/getUserRatioOfDifferentMonths.controller';
import { getRecentUsersController } from '../controller/getRecentUsers.controller';
import { getNotificationsForAdminController } from '../controller/getNotificationsForAdmin.controller';
import { getSingleUserDataController } from '../controller/getSingleUserData.controller';
import { unbanUserController } from '../controller/unbanUser.controller';
import { addCategoryController } from '../controller/addCategories.controller';
import { updateCategoryController } from '../controller/updateCategories.controller';
import { getCollaboratorsDataController } from '../controller/getCollaboratorsData.controller';
import { addSubscriptionPackagesController } from '../controller/addSubscriptionPackages.controller';
import { editSubscriptionPackagesController } from '../controller/editSubscriptionPackages.controller';
import { getTransactionDataController } from '../controller/getTransactionData.controller';
import { getSingleTransactionDataController } from '../controller/getSingleTransactionData.controller';
import { updateProfileController } from '../../auth_v2/controller/updateProfile.controller';
import { updateGeneralInfoController } from '../controller/updateGeneralInfo.controller';
import { getSingleUserDataController2 } from '../controller/getSingleUserData_2.controller';
import { banUserController2 } from '../controller/banUser_2.controller';
import { unbanUserController2 } from '../controller/unbanUser_2.controller';
import { getCategoriesController } from '../../categories/controller/getCategories.controller';
import { getSingleCategoryController } from '../../categories/controller/getSingleCategory.controller';
import { getSubscriptionPackagesController } from '../../subscription_packages/controller/getSubscriptionPackages.controller';
import { getSingleSubscriptionPackagesController } from '../../subscription_packages/controller/getSingleSubscriptionPackages.controller';
import { deleteCategoryController } from '../../categories/controller/deleteCategory.controller';
import { deleteSubscriptionController } from '../../subscription_packages/controller/deleteSubscription.controller';
import { getSettingsDataController } from '../controller/getSettingsData.controller';
import { updateSettingsController } from '../controller/updateSettings.controller';
import { changePasswordController3 } from '../controller/changePassword3.controller';
import { getGeneralInfoController } from '../../general_info/controller/getGeneralInfo.controller';
import { addFaqController } from '../../general_info/controller/addFaq.controller';
import { deleteFaqController } from '../../general_info/controller/deleteFaq.controller';
import { getDataOfUnapprovedAuthCardImagesController } from '../controller/getDataOfUnApprovedAuthCardImages.controller';
import { approveOrRejectAuthCardController } from '../controller/approveOrRejectAuthCardImage.controller';
import { addLawyerController } from '../../lawyer/controller/addLawyer.controller';
import { getLawyerDataController } from '../../lawyer/controller/getDataOfLawyers.controller';
import { inviteLawyerController } from '../../lawyer/controller/inviteLawyer.controller';
import { deleteLawyerController } from '../../lawyer/controller/deleteLawyer.controller';
import { addSuperAdminController } from '../controller/addSuperAdmin.controller';
import { getTotalUsersDriversCompletedTripsCancelledTripsController } from '../controller/getTotalUsersDriversCompletedTripsCancelledTrips.controller';
import { createNewAdminController } from '../controller/createNewAdmin.controller';
import { adminLogInController } from '../controller/adminLogIn.controller';
import { getTotalUsersTotalIncomeAndUserAndDriverRatioController } from '../controller/getTotalUsersAndIncomeAndUserAndDriverRatio.controller';
import { getNewestFiveUsersController } from '../controller/getNewestFiveUsers.controller';
import { getUsersListWithPaginationController } from '../controller/getUsersDataWithPagination.controller';
import { banUserController3 } from '../controller/banUser3.controller';
import { unBanUserController3 } from '../../user_v2/controller/unbanUser.controller';
import { getSingleUserDetailsController } from '../controller/getSingleUserDetails.controller';
import { getDriversListWithPaginationController } from '../controller/getDriversDataWithPagination.controller';
import { getRequestsToWithdrawController } from '../controller/getRequestsToWithdraw.controller';
import { getWithdrawRequestDetailsController } from '../controller/getWithdrawRequestDetails.controller';
import { uploadInvoiceOfPaymentToDriverController } from '../controller/uploadInvoiceOfPaymentToDriver.controller';

const adminRouterV2 = express.Router();

adminRouterV2.post('/add-super-admin-poqwe', addSuperAdminController);
adminRouterV2.post('/sign-in', adminSignInController);
adminRouterV2.get('/get-dashboard-data', getAdminDashboardDataController);
adminRouterV2.get('/get-user-data', getUserDataController);
adminRouterV2.get('/get-collaborator-data', getCollaboratorsDataController);
adminRouterV2.get('/get-single-user-data', getSingleUserDataController);
adminRouterV2.post('/ban-user-old', banUserController);
adminRouterV2.post('/ban-user-2/:id', banUserController2);
adminRouterV2.post('/unban-user-old', unbanUserController);
adminRouterV2.post('/unban-user-2/:id', unbanUserController2);
adminRouterV2.get('/get-reviews-data', getReviewsDataForAdminController);
adminRouterV2.post('/remove-reviews-data', getReviewsDataForAdminController);
adminRouterV2.post('/forgot-password', adminForgotPasswordController);
adminRouterV2.post(
  '/verify-forgot-password-otp',
  verifyForgotPasswordOtpController
);
adminRouterV2.post('/change-admin-password', changeAdminPasswordController);
adminRouterV2.post('/change-admin-password-2', changePasswordController2);
adminRouterV2.post('/change-admin-password-3', changePasswordController3);
adminRouterV2.post('/update-profile', updateProfileController);
adminRouterV2.post('/remove-product', removeProductController);
adminRouterV2.get('/total-number-of-user', getTotalNumberOfUserController);
adminRouterV2.get(
  '/total-amount-of-earnings',
  getTotalAmountOfEarningsController
);
adminRouterV2.get(
  '/earnings-in-different-time',
  getIncomeOfDifferentMonthsController
);
adminRouterV2.get(
  '/user-ratio-of-different-month',
  getUserRatioOfDifferentMonthsController
);
adminRouterV2.get('/recent-users', getRecentUsersController);
adminRouterV2.get('/notifications', getNotificationsForAdminController);
adminRouterV2.get('/single-user', getSingleUserDataController);
adminRouterV2.get('/get-single-user-data/:id', getSingleUserDataController2);

adminRouterV2.get('/categories', getCategoriesController);
adminRouterV2.get('/categories/:id', getSingleCategoryController);

adminRouterV2.post('/categories/add', addCategoryController);
adminRouterV2.post('/categories/update', updateCategoryController);
adminRouterV2.post('/categories/delete/:id', deleteCategoryController);

adminRouterV2.get('/subscription-packages', getSubscriptionPackagesController);
adminRouterV2.get(
  '/subscription-packages/:id',
  getSingleSubscriptionPackagesController
);

adminRouterV2.post('/subscription/add', addSubscriptionPackagesController);
adminRouterV2.post('/subscription/edit', editSubscriptionPackagesController);

adminRouterV2.post('/subscription/delete/:id', deleteSubscriptionController);
adminRouterV2.get('/payment', getTransactionDataController);
adminRouterV2.get('/payment/:id', getSingleTransactionDataController);
adminRouterV2.post('/general-info/update/:name', updateGeneralInfoController);
adminRouterV2.get('/general-info', getGeneralInfoController);
adminRouterV2.get('/general-info/:name', getGeneralInfoController);

adminRouterV2.get('/get-settings-data', getSettingsDataController);
adminRouterV2.post('/update-settings', updateSettingsController);
adminRouterV2.post('/general-info/add-new-faq', addFaqController);
adminRouterV2.post('/general-info/delete-faq', deleteFaqController);
adminRouterV2.get(
  '/get-data-of-unapproved-auth-card-image',
  getDataOfUnapprovedAuthCardImagesController
);
adminRouterV2.post(
  '/approve-or-reject-authcard-image',
  approveOrRejectAuthCardController
);

adminRouterV2.post('/lawyer/add-lawyer', addLawyerController);
adminRouterV2.get('/lawyer/get-lawyer-data', getLawyerDataController);
adminRouterV2.post('/lawyer/invite-lawyer', inviteLawyerController);
adminRouterV2.post('/lawyer/delete-lawyer', deleteLawyerController);
adminRouterV2.get(
  '/get-total-users-drivers-income-completed-trips-cancelled-trips',
  getTotalUsersDriversCompletedTripsCancelledTripsController
);
adminRouterV2.get(
  '/get-income-of-different-month',
  getIncomeOfDifferentMonthsController
);
adminRouterV2.get(
  '/get-total-users-total-income-total-users-and-drivers-ratio',
  getTotalUsersTotalIncomeAndUserAndDriverRatioController
);
adminRouterV2.get('/create-new-admin', createNewAdminController);
adminRouterV2.post('/log-in', adminLogInController);
adminRouterV2.get('/get-newest-five-users', getNewestFiveUsersController);
adminRouterV2.get(
  '/get-users-data-with-pagination',
  getUsersListWithPaginationController
);
adminRouterV2.post('/ban-user', banUserController3);
adminRouterV2.post('/unban-user', unBanUserController3);
adminRouterV2.get('/get-single-user-details', getSingleUserDetailsController);
adminRouterV2.get(
  '/get-drivers-data-with-pagination',
  getDriversListWithPaginationController
);
adminRouterV2.get('/get-requests-to-withdraw', getRequestsToWithdrawController);

adminRouterV2.post(
  '/upload-invoice-of-payment-to-driver',
  uploadInvoiceOfPaymentToDriverController
);

export { adminRouterV2 };
