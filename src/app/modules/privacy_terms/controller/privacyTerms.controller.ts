import { privacyTermsModel } from '../model/privacyTerms.model';

console.log('hello');
export const createPrivacyTermsIfNotCreatedFunction = async () => {
  try {
    const privacyPolicy = await privacyTermsModel.find({});
    if (privacyPolicy.length > 0) {
      return;
    }

    await privacyTermsModel.create({
      privacy_terms: `At Property AI, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy outlines how we collect, use, store, and safeguard your data when you visit or interact with our website. We collect only the information necessary to enhance your experience, such as your name, email address, and browsing activities. This data is used solely to improve our services, respond to inquiries, and provide relevant content. We employ industry-standard security measures to protect your data from unauthorized access, loss, or misuse. We do not sell, share, or trade your personal information with third parties, except as required by law or to service providers who assist us in our operations, under strict confidentiality agreements. You have the right to access, correct, or delete your personal information at any time. By using our website, you consent to our privacy practices outlined in this policy. We reserve the right to update or modify this policy as necessary, and any changes will be communicated through this page. Please check periodically for the latest updates.`,
    });
    console.log('privacy policy created successfully');
  } catch (error) {
    console.log(error);
  }
};
