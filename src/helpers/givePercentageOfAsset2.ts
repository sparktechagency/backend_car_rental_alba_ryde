export const givePercentageOfAsset2 = (assets: any[]): any[] => {
  const assetTypes = [
    'financial asset',
    'debts & liabilities',
    'personal docs',
    'memoirs/others',
    'real estate',
    'tangible asset',
  ];

  const typeCounts: any = {};
  const totalAssets: number = assets.length;
  const percentages: any[] = [];

  // Initialize all types with 0 count
  for (let i = 0; i < assetTypes.length; i++) {
    typeCounts[assetTypes[i]] = 0;
  }

  // Count occurrences of each asset type
  for (let i = 0; i < totalAssets; i++) {
    const type: any = assets[i].type;
    if (typeCounts.hasOwnProperty(type)) {
      typeCounts[type]++;
    }
  }

  // Calculate percentages
  for (let i = 0; i < assetTypes.length; i++) {
    percentages[i] = {
      type: assetTypes[i],
      percentage:
        Math.round((typeCounts[assetTypes[i]] / totalAssets) * 100) || 0,
    };
  }

  return percentages;
};
