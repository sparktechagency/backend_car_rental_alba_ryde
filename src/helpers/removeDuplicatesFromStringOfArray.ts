type removeDuplicatesType = (arrayOfStrings: string[]) => string[];

export const removeDuplicates: removeDuplicatesType = arr => {
  const uniqueArr: string[] = [];
  const seen: Record<string, boolean> = {}; // Explicitly typed

  for (let i = 0; i < arr.length; i++) {
    const value: string = arr[i];

    if (!seen[value]) {
      seen[value] = true;
      uniqueArr[uniqueArr.length] = value; // Add only unique values
    }
  }

  return uniqueArr;
};
