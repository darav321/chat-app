import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import upload from "../../helpers/uploadFile";
import axios from "axios";
import { setUser } from "../../redux/userSlice";
import toast from "react-hot-toast";

const EditUserDetails = ({ onClose, user }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    name: user.name,
    profilePic: user.profilePic,
  });

  useEffect(() => {
    setData((prev) => {
      return {
        ...prev,
        ...user,
      };
    });
  }, [user]);

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    const uploadFile = await upload(file);

    setData((prev) => {
      return {
        ...prev,
        profilePic: uploadFile.url,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await axios.patch(
        "https://chatmore-vkco.onrender.com/api/user/update"
      );
      toast.success(response.data.message)
      dispatch(setUser(data));
      onClose();
    } catch (error) {}
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 bg-slate-900 z-10 bg-opacity-30 flex justify-center items-center">
      <div className="bg-white rounded-md px-10 py-5 max-w-sm w-full flex items-center justify-center flex-col">
        <h2 className="text-gray-700 font-semibold text-lg">
          Edit Profile Detail
        </h2>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1 w-full">
            <label className="text-gray-600 font-medium" htmlFor="name">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={data.name}
              onChange={handleOnChange}
              className="px-3 py-1 border-gray-200 border shadow-lg"
            />
          </div>

          <div>
            <label className="flex flex-row gap-10 mt-5" htmlFor="profilePic">
              <p>Photo:</p>
              <div className="cursor-pointer">
                <Avatar
                  userId={user._id}
                  width={30}
                  height={30}
                  name={data.name}
                  imageURL={data.profilePic}
                />
              </div>
            </label>
            <input
              type="file"
              className="hidden"
              id="profilePic"
              onChange={handleUploadPhoto}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-2 items-center justify-center mt-5">
            <button
              type="submit"
              className="px-3 py-1 text-lg font-semibold border hover:shadow-lg cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 text-lg font-semibold border hover:shadow-lg cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetails;
