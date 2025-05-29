import { ErrorRequestHandler } from 'express';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import handleValidationError from '../../errors/handleValidationError';
import handleZodError from '../../errors/handleZodError';
import handleDuplicateError from '../../errors/handleDuplicateError';
import { errorLogger } from '../../shared/logger';
import { IErrorMessage } from '../../types/errors.types';
import { StatusCodes } from 'http-status-codes';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // Log error based on environment
  if (config.env === 'development') {
    console.log('🚨 globalErrorHandler ~~ ', error);
  } else {
    errorLogger.error('🚨 globalErrorHandler ~~ ', error);
  }

  let code = 500;
  let message = error.message || 'Something went wrong';
  let errorMessages: IErrorMessage[] = [];
  console.log('error is', error);

  // Handle Incorrect Password Error
  if (error === 'Password is incorrect') {
    code = 401; // Unauthorized
    message = 'The password you entered is incorrect.';
    errorMessages = [{ path: 'password', message }];
  } else if (error.message === 'please insert image') {
    code = StatusCodes.BAD_REQUEST; // Unauthorized
    message = 'please insert image';
    errorMessages = [{ path: 'unknown', message }];
  } else if (error === 'user is banned') {
    code = StatusCodes.FORBIDDEN; // Unauthorized
    message = 'user is banned';
    errorMessages = [{ path: 'unknown', message }];
  } else if (error?.message === 'user is banned') {
    code = StatusCodes.FORBIDDEN; // Unauthorized
    message = 'user is banned';
    errorMessages = [{ path: 'unknown', message }];
  } else if (error.message === 'user did not created vault password yet') {
    code = StatusCodes.FORBIDDEN; // Unauthorized
    message = 'user did not created vault password yet';
    errorMessages = [{ path: 'unknown', message }];
  } else if (error.message === 'jwt must be provided') {
    code = 401; // Unauthorized
    message = 'jwt must be provided';
    errorMessages = [{ path: 'unknown', message }];
  }
  // HANDLE USER DOES NOT EXISTS ERROR
  else if (error.message === 'USER_DOES_NOT_EXISTS') {
    code = StatusCodes.NOT_FOUND;
    message = 'User does not exists';
    errorMessages = [{ path: 'unknown', message }];
  }
  // Handle Zod Validation Error
  else if (error.name === 'ZodError') {
    const simplifiedError = handleZodError(error);
    code = 400;
    message = simplifiedError.errorMessages.map(err => err.message).join(', ');
    errorMessages = simplifiedError.errorMessages;
  }
  // Handle Mongoose ValidationError
  else if (error.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    code = 400;
    message = simplifiedError.errorMessages.map(err => err.message).join(', ');
    errorMessages = simplifiedError.errorMessages;
  }
  // Handle MongoDB Duplicate Key Error
  else if (error.code === 11000 || error.code === 11001) {
    const simplifiedError = handleDuplicateError(error);
    code = 409; // Conflict
    message = simplifiedError.errorMessages.map(err => err.message).join(', ');
    errorMessages = simplifiedError.errorMessages;
  }
  // Handle Custom API Error
  else if (error instanceof ApiError) {
    code = error.code || 500;
    message = error.message || 'Something went wrong';
    errorMessages = error.message ? [{ path: '', message: error.message }] : [];
  }
  // Handle General Errors
  else if (error instanceof Error) {
    message = error.message || 'Internal Server Error';
    errorMessages = error.message ? [{ path: '', message: error.message }] : [];
  }
  // Handle Unknown Errors
  else {
    message = typeof error === 'string' ? error : JSON.stringify(error);
    errorMessages = [{ path: '', message }];
  }

  if (
    typeof error === 'string' &&
    (error.includes('not exist') || error.includes('there is no'))
  ) {
    code = StatusCodes.NOT_FOUND;
    message = error;
  } else if (
    error instanceof Error &&
    (error.message.includes('not exist') ||
      error.message.includes('there is no'))
  ) {
    code = StatusCodes.NOT_FOUND;
    message = error.message;
  } else if (typeof error === 'string' && error.includes('not authorized')) {
    code = StatusCodes.UNAUTHORIZED;
    message = error;
  } else if (
    error instanceof Error &&
    error.message.includes('not authorized')
  ) {
    code = StatusCodes.UNAUTHORIZED;
    message = error.message;
  } else if (
    typeof error === 'string' &&
    (error.includes('not have permission') || error.includes('not admin'))
  ) {
    code = StatusCodes.UNAUTHORIZED;
    message = error;
  } else if (
    error instanceof Error &&
    (error.message.includes('not have permission') ||
      error.message.includes('not admin'))
  ) {
    code = StatusCodes.UNAUTHORIZED;
    message = error.message;
  } else if (
    typeof error === 'string' &&
    (error.includes('please enter') ||
      error.includes('invalid') ||
      error.includes('not valid') ||
      error.includes('please give') ||
      error.includes('please turn on') ||
      error.includes('is not requestable'))
  ) {
    code = StatusCodes.BAD_REQUEST;
    message = error;
  } else if (
    error instanceof Error &&
    (error.message.includes('please enter') ||
      error.message.includes('invalid') ||
      error.message.includes('not valid') ||
      error.message.includes('please give') ||
      error.message.includes('please turn on') ||
      error.message.includes('is not requestable'))
  ) {
    code = StatusCodes.BAD_REQUEST;
    message = error.message;
  } else if (
    typeof error === 'string' &&
    (error.includes('is already') ||
      error === 'user can not accept his own drive request' ||
      error === 'plz complete your ongoing trip first' ||
      error === 'you already accepted this' ||
      error === 'you already rejected this trip' ||
      error.includes('you already have'))
  ) {
    code = StatusCodes.CONFLICT;
    message = error;
  } else if (
    error instanceof Error &&
    (error.message.includes('is already') ||
      error.message === 'user can not accept his own drive request' ||
      error.message === 'plz complete your ongoing trip first' ||
      error.message === 'you already accepted this' ||
      error.message === 'you already rejected this trip' ||
      error.message.includes('you already have'))
  ) {
    code = StatusCodes.CONFLICT;
    message = error.message;
  } else if (typeof error === 'string' && error.includes('not acceptable')) {
    code = StatusCodes.NOT_ACCEPTABLE;
    message = error;
  } else if (
    error instanceof Error &&
    error.message.includes('not acceptable')
  ) {
    code = StatusCodes.NOT_ACCEPTABLE;
    message = error.message;
  } else if (
    typeof error === 'string' &&
    error.includes('this trip is not rejectable')
  ) {
    code = StatusCodes.LOCKED;
    message = error;
  } else if (
    error instanceof Error &&
    error.message.includes('this trip is not rejectable')
  ) {
    code = StatusCodes.LOCKED;
    message = error.message;
  } else if (typeof error === 'string' && error.includes('not eligible')) {
    code = StatusCodes.FORBIDDEN;
    message = error;
  } else if (error instanceof Error && error.message.includes('not eligible')) {
    code = StatusCodes.FORBIDDEN;
    message = error.message;
  }

  errorMessages = [{ path: 'unknown', message }];

  // Send response
  res.status(code).json({
    code,
    success: false,
    message,
    errors: errorMessages, // Detailed error messages
    stack: config.env === 'development' ? error?.stack : undefined, // Stack trace only in development
  });
};

export default globalErrorHandler;
