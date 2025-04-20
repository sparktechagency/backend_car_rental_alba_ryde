const dummyUserData = [
  {
    email: 'newuser1@example.com',
    passwordHash:
      '$2a$10$gwwevIakYamspvQX6F/MWOtm85FbH8sjOLhi595dJKy4RJqAPRpLG',
    role: 'user',
    fullName: 'Liam Johnson',
    phoneNumber: '+8801771234567',
    passportImageUrl: '',
    idCardImageUrl: '',
    drivingLicenseImageUrl: '',
    profileImageUrl: '',
    isBanned: false,
  },
  {
    email: 'newuser2@example.com',
    passwordHash:
      '$2a$10$gwwevIakYamspvQX6F/MWOtm85FbH8sjOLhi595dJKy4RJqAPRpLG',
    role: 'collaborator',
    fullName: 'Olivia Williams',
    phoneNumber: '+8801887654321',
    passportImageUrl: '',
    idCardImageUrl: '',
    drivingLicenseImageUrl: '',
    profileImageUrl: '',
    isBanned: false,
  },
  {
    email: 'newuser3@example.com',
    passwordHash:
      '$2a$10$gwwevIakYamspvQX6F/MWOtm85FbH8sjOLhi595dJKy4RJqAPRpLG',
    role: 'user',
    fullName: 'Noah Brown',
    phoneNumber: '+8801556781234',
    passportImageUrl: '',
    idCardImageUrl: '',
    drivingLicenseImageUrl: '',
    profileImageUrl: '',
    isBanned: false,
  },
  {
    email: 'newuser4@example.com',
    passwordHash:
      '$2a$10$gwwevIakYamspvQX6F/MWOtm85FbH8sjOLhi595dJKy4RJqAPRpLG',
    role: 'collaborator',
    fullName: 'Emma Davis',
    phoneNumber: '+8801674321987',
    passportImageUrl: '',
    idCardImageUrl: '',
    drivingLicenseImageUrl: '',
    profileImageUrl: '',
    isBanned: false,
  },
  {
    email: 'newuser5@example.com',
    passwordHash:
      '$2a$10$gwwevIakYamspvQX6F/MWOtm85FbH8sjOLhi595dJKy4RJqAPRpLG',
    role: 'user',
    fullName: 'William Martinez',
    phoneNumber: '+8801998765432',
    passportImageUrl: '',
    idCardImageUrl: '',
    drivingLicenseImageUrl: '',
    profileImageUrl: '',
    isBanned: false,
  },
  {
    email: 'newuser6@example.com',
    passwordHash:
      '$2a$10$gwwevIakYamspvQX6F/MWOtm85FbH8sjOLhi595dJKy4RJqAPRpLG',
    role: 'collaborator',
    fullName: 'Sophia Taylor',
    phoneNumber: '+8801512348765',
    passportImageUrl: '',
    idCardImageUrl: '',
    drivingLicenseImageUrl: '',
    profileImageUrl: '',
    isBanned: false,
  },
  {
    email: 'newuser7@example.com',
    passwordHash:
      '$2a$10$gwwevIakYamspvQX6F/MWOtm85FbH8sjOLhi595dJKy4RJqAPRpLG',
    role: 'user',
    fullName: 'James Anderson',
    phoneNumber: '+8801456784321',
    passportImageUrl: '',
    idCardImageUrl: '',
    drivingLicenseImageUrl: '',
    profileImageUrl: '',
    isBanned: false,
  },
  {
    email: 'newuser8@example.com',
    passwordHash:
      '$2a$10$gwwevIakYamspvQX6F/MWOtm85FbH8sjOLhi595dJKy4RJqAPRpLG',
    role: 'collaborator',
    fullName: 'Isabella Thomas',
    phoneNumber: '+8801387654321',
    passportImageUrl: '',
    idCardImageUrl: '',
    drivingLicenseImageUrl: '',
    profileImageUrl: '',
    isBanned: false,
  },
  {
    email: 'newuser9@example.com',
    passwordHash:
      '$2a$10$gwwevIakYamspvQX6F/MWOtm85FbH8sjOLhi595dJKy4RJqAPRpLG',
    role: 'user',
    fullName: 'Benjamin White',
    phoneNumber: '+8801276543219',
    passportImageUrl: '',
    idCardImageUrl: '',
    drivingLicenseImageUrl: '',
    profileImageUrl: '',
    isBanned: false,
  },
  {
    email: 'newuser10@example.com',
    passwordHash:
      '$2a$10$gwwevIakYamspvQX6F/MWOtm85FbH8sjOLhi595dJKy4RJqAPRpLG',
    role: 'collaborator',
    fullName: 'Mia Harris',
    phoneNumber: '+8801178321465',
    passportImageUrl: '',
    idCardImageUrl: '',
    drivingLicenseImageUrl: '',
    profileImageUrl: '',
    isBanned: false,
  },
  {
    email: 'newuser11@example.com',
    passwordHash:
      '$2a$10$gwwevIakYamspvQX6F/MWOtm85FbH8sjOLhi595dJKy4RJqAPRpLG',
    role: 'user',
    fullName: 'Lucas Clark',
    phoneNumber: '+8801065478293',
    passportImageUrl: '',
    idCardImageUrl: '',
    drivingLicenseImageUrl: '',
    profileImageUrl: '',
    isBanned: false,
  },
  {
    email: 'newuser12@example.com',
    passwordHash:
      '$2a$10$gwwevIakYamspvQX6F/MWOtm85FbH8sjOLhi595dJKy4RJqAPRpLG',
    role: 'collaborator',
    fullName: 'Ava Lewis',
    phoneNumber: '+8801567839201',
    passportImageUrl: '',
    idCardImageUrl: '',
    drivingLicenseImageUrl: '',
    profileImageUrl: '',
    isBanned: false,
  },
  {
    email: 'newuser13@example.com',
    passwordHash:
      '$2a$10$gwwevIakYamspvQX6F/MWOtm85FbH8sjOLhi595dJKy4RJqAPRpLG',
    role: 'user',
    fullName: 'Henry Walker',
    phoneNumber: '+8801684930217',
    passportImageUrl: '',
    idCardImageUrl: '',
    drivingLicenseImageUrl: '',
    profileImageUrl: '',
    isBanned: false,
  },
  {
    email: 'newuser14@example.com',
    passwordHash:
      '$2a$10$gwwevIakYamspvQX6F/MWOtm85FbH8sjOLhi595dJKy4RJqAPRpLG',
    role: 'collaborator',
    fullName: 'Evelyn Hall',
    phoneNumber: '+8801928346570',
    passportImageUrl: '',
    idCardImageUrl: '',
    drivingLicenseImageUrl: '',
    profileImageUrl: '',
    isBanned: false,
  },
];

import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';

export const makeDummyUserController = myControllerHandler(async (req, res) => {
  for (let i = 0; i < dummyUserData.length; i++) {
    const singleUserData = dummyUserData[i];
    await userModelOfMantled.create(singleUserData);
  }

  const myResponse = {
    message: 'Review Given Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
