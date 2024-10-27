import { getFirestore, doc, getDoc } from "firebase/firestore";

export const fetchUserById = async (userId) => {
  const db = getFirestore();
  const userRef = doc(db, "teams", userId); // Correctly referencing the user document in the "users" collection
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data() : null;
};
