import express from 'express';
import { AdminRoutes } from '../app/modules/admin/admin.routes';
import { AuthRoutes } from '../app/modules/Auth/auth.route';
import { ContactRoutes } from '../app/modules/contact/contact.routes';
import { SettingsRoutes } from '../app/modules/settings/settings.routes';
import { UserRoutes } from '../app/modules/user/user.route';
import { JobRoutes } from '../app/modules/job/job.routes';
import { BidJobRoutes } from '../app/modules/bidJob/bidJob.routes';
import { NotificationRoutes } from '../app/modules/notification/notification.routes';
import { reviewRouter } from '../app/modules/review/route/review.route';
import { adminRouterV2 } from '../app/modules/admin-v2/route/adminV2.route';
import { authV2Router } from '../app/modules/auth_v2/route/authV2.route';
import { assetRoutes } from '../app/modules/asset/route/asset.route';
import { notificationRouterV2 } from '../app/modules/notifications_v2/route/notification.route';
import { collaborationRouter } from '../app/modules/collaboration/route/collaborator.route';
import { homeRouter } from '../app/modules/home/route/home.route';
import { invitationRouter } from '../app/modules/invitation/route/invitation.route';
import { vaultRouter } from '../app/modules/vault/route/vault.route';
import { userRouterV2 } from '../app/modules/user_v2/route/userV2.route';
import { generalInfoRouter } from '../app/modules/general_info/route/generalInfo.model';
import { categoriesRouter } from '../app/modules/categories/routes/categories.route';
import { subscriptionPackagesRouter } from '../app/modules/subscription_packages/route/subscriptionPackages.route';
import { testRouter } from '../app/modules/test/route/test.route';
import { lawyerRouter } from '../app/modules/lawyer/route/lawyer.route';
import { chatGptRouter } from '../app/modules/chatgpt/route/chatgpt.route';
import { faqRouter } from '../app/modules/faq/route/faq.route';
import { propertyBlogRouter } from '../app/modules/property_blog/route/blogs.route';
import { propertyRouter } from '../app/modules/property/route/property.route';
import { propertyChatRouter } from '../app/modules/property_chat/route/propertyChat.route';
import { privacyTermsRouter } from '../app/modules/privacy_terms/route/privacyTerm.route';
import { locationRouter } from '../app/modules/location/route/location.route';
import { driverRouter } from '../app/modules/driver/route/driver.route';
import { carRouter } from '../app/modules/car/route/car.route';
import { tripRouter } from '../app/modules/trip/route/trip.route';
import { paymentRouter } from '../app/modules/payment_v2/route/payment.route';

const router = express.Router();

const apiRoutes = [
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/admin/v2',
    route: adminRouterV2,
  },
  {
    path: '/auth',
    route: authV2Router,
  },
  {
    path: '/jobs',
    route: JobRoutes,
  },
  {
    path: '/bid-jobs',
    route: BidJobRoutes,
  },
  {
    path: '/settings',
    route: SettingsRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/contact',
    route: ContactRoutes,
  },
  { path: '/review', route: reviewRouter },
  { path: '/asset', route: assetRoutes },
  { path: '/notification/v2', route: notificationRouterV2 },
  { path: '/collaboration', route: collaborationRouter },
  { path: '/home', route: homeRouter },
  { path: '/invite', route: invitationRouter },
  { path: '/vault', route: vaultRouter },
  { path: '/user/v2', route: userRouterV2 },
  { path: '/general-info', route: generalInfoRouter },
  { path: '/categories', route: categoriesRouter },
  { path: '/subscription-packages', route: subscriptionPackagesRouter },
  { path: '/test', route: testRouter },
  { path: '/lawyer', route: lawyerRouter },
  { path: '/chatgpt', route: chatGptRouter },
  {
    path: '/faq',
    route: faqRouter,
  },
  {
    path: '/property-blog',
    route: propertyBlogRouter,
  },
  {
    path: '/property',
    route: propertyRouter,
  },
  {
    path: '/property-chat',
    route: propertyChatRouter,
  },
  {
    path: '/privacy-terms',
    route: privacyTermsRouter,
  },
  {
    path: '/location',
    route: locationRouter,
  },
  {
    path: '/driver',
    route: driverRouter,
  },
  {
    path: '/car',
    route: carRouter,
  },
  {
    path: '/trip',
    route: tripRouter,
  },
  {
    path: '/payment',
    route: paymentRouter,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
