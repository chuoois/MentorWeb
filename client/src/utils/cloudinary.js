// src/utils/cloudinary.js
export const uploadToCloudinary = async (file) => {
  const CLOUD_NAME = "doevhf5tms"; 
  const UPLOAD_PRESET = "my_unsigned_preset"; 

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!data.secure_url) {
    throw new Error("Upload thất bại");
  }

  return data.secure_url;
};
