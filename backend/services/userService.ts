import { saveUserDataToBlob, saveLoginTimestamp } from '../utils/blobStorage';

export const saveUser = async (user: { name: string, email: string }) => {
  await saveUserDataToBlob(user.name, user.email);
  await saveLoginTimestamp(user.email);  // Log the timestamp separately
};
