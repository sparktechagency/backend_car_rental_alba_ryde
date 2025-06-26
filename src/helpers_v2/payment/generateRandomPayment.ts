import mongoose from 'mongoose';
import { ar7id } from '../../helpers/ar7Id'; // Assuming this function generates a random string for the 'id' field

const generateRandomPayment = () => {
  // Helper functions for random values
  const randomString = (length = 10) =>
    Math.random()
      .toString(36)
      .substring(2, 2 + length); // Generate random alphanumeric string

  const randomAmount = () => Math.floor(Math.random() * 10000) + 1; // Random amount in cents (1 to 10,000)

  const randomStatus = () => {
    const statuses = [
      'requires_payment_method',
      'requires_confirmation',
      'requires_action',
      'processing',
      'requires_capture',
      'canceled',
      'succeeded',
    ];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const randomCaptureMethod = () => {
    const captureMethods = ['automatic', 'manual', 'automatic_async'];
    return captureMethods[Math.floor(Math.random() * captureMethods.length)];
  };

  const randomConfirmationMethod = () => {
    const confirmationMethods = ['automatic', 'manual'];
    return confirmationMethods[
      Math.floor(Math.random() * confirmationMethods.length)
    ];
  };

  // Helper function to generate random date within the year 2025
  const randomDateIn2025 = () => {
    const startOf2025 = new Date('2025-01-01T00:00:00Z');
    const endOf2025 = new Date('2025-12-31T23:59:59Z');

    // Randomly generate a date between January 1, 2025, and December 31, 2025
    const randomTimestamp =
      startOf2025.getTime() +
      Math.floor(Math.random() * (endOf2025.getTime() - startOf2025.getTime()));
    return new Date(randomTimestamp);
  };

  // Generate the random values for each field
  const randomPayment = {
    id: 'pay_' + ar7id(),
    paymentIntentId: 'pi_' + randomString(10),
    customerId: 'cus_' + randomString(10),
    paymentMethodId: 'pm_' + randomString(10),
    amount: randomAmount(),
    amountReceived: randomAmount(),
    currency: 'usd', // assuming USD as default currency
    status: randomStatus(),
    captureMethod: randomCaptureMethod(),
    confirmationMethod: randomConfirmationMethod(),
    latestChargeId: 'ch_' + randomString(10),
    clientSecret: 'cs_' + randomString(20),
    description: 'Random payment description',
    receiptEmail: `test${Math.floor(Math.random() * 1000)}@example.com`,
    setupFutureUsage: Math.random() > 0.5 ? 'on_session' : 'off_session', // Randomly set to 'on_session' or 'off_session'
    metadata: {
      exampleMetadata: randomString(15),
    },
    createdAt: randomDateIn2025(), // Random createdAt within 2025
    updatedAt: randomDateIn2025(), // Random updatedAt within 2025
  };

  return randomPayment;
};

// Example usage function to generate new data each time
export const generateNewRandomPayment = () => {
  return generateRandomPayment();
};
