let useBackup = false;

export const runPrimary = async <T>(operation: () => Promise<T>): Promise<T> => {

  if (useBackup) {
    throw new Error("Primary database disabled");
  }

  try {
    return await operation();

  } catch (error) {
    console.log("Firebase failed. Switching to MongoDB backup");
    useBackup = true;
    throw error;
  }

};