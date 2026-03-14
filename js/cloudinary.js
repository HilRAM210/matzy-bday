import cloudinaryConfig from "./cloudinary-config.js";

const { cloudName, uploadPreset } = cloudinaryConfig;

/**
 * Upload file gambar ke Cloudinary
 * @param {File} file - File object dari input[type=file]
 * @returns {Promise<string>} URL gambar yang sudah diupload
 */
export async function uploadPhoto(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Upload gagal");

  const data = await res.json();
  return data.secure_url;
}
