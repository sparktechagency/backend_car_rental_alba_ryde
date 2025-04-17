export const givePercentageOfAsset = (assets: any[]): any[] => {
  const typeCounts: any = {};
  const totalAssets: number = assets.length;
  const percentages: any[] = [];

  // Count occurrences of each asset type
  for (let i = 0; i < totalAssets; i++) {
    const type: any = assets[i].type;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }

  // Extract keys and values manually and calculate percentages
  const typeKeys: any[] = Object.keys(typeCounts);
  const typeValues: any[] = Object.values(typeCounts);

  for (let i = 0; i < typeKeys.length; i++) {
    percentages[i] = {
      type: typeKeys[i],
      percentage: Math.round((typeValues[i] / totalAssets) * 100), // Rounded to nearest integer
    };
  }

  return percentages;
};
