import { storage } from "./firebase.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-storage.js";

/**
 * Upload file gambar ke Firebase Storage
 * @param {File} file
 * @returns {Promise<string>} Download URL
 */
export async function uploadPhoto(file) {
  const fileName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `cards/${fileName}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}
