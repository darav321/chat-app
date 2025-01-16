const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`;

const upload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "socket");

  const response = await fetch(url, { method: "post", body: formData });

  const responseData = await response.json();

  return responseData;
};

export default upload;
