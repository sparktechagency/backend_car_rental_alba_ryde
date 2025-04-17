import bcrypt from 'bcryptjs';
let saltRounds = 10;
export const hashMyPassword = (plainPassword: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(
      plainPassword,
      saltRounds,
      (error: Error | null, hashedPassword: string) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        } else {
          resolve(hashedPassword);
          return;
        }
      }
    );
  });
};
// export const checkPasswordOld = (
//   plainPassword: string,
//   hashedPassword: string
// ) => {
//   return new Promise((resolve, reject) => {
//     let isMatch = bcrypt.compareSync(plainPassword, hashedPassword);
//     resolve(isMatch);
//   });
// };

export const checkMyPassword = (
  plainPassword: string,
  hashedPassword: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isMatch = bcrypt.compareSync(plainPassword, hashedPassword);
      if (isMatch) {
        resolve('Password Is Correct');
      } else {
        reject('Password is incorrect');
      }
    } catch (error: any) {
      console.log(error);
      if (error.message) {
        reject(error.message);
      } else {
        reject(error);
      }
    }
  });
};
