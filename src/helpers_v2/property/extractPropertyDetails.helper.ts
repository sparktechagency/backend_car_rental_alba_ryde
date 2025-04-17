export const extractPropertyDetails = (properties: Array<any>) => {
  return properties.map(property => ({
    address: property.address,
    agentPhoneNumber: property.agent.phone,
    firstImageUrl: property.imageUris[0],
    price: property.pricing.label,
  }));
};
