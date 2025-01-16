import React, { useState } from "react";
import upload from "../../helpers/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/userSlice";

const Register = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [uploadPhoto, setUploadPhoto] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const url = "https://chatmore-vkco.onrender.com/api/user/login";

    try {
      const response = await axios({
        method: "post",
        url: url,
        data: { email: data.email, password: data.password },
        withCredentials: true,
      });
      console.log(response);
      toast.success(response.data.message);

      dispatch(setToken(response.data.accessToken));
      localStorage.setItem("token", response.data.accessToken);

      setData({
        email: "",
        password: "",
      });

      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col gap-3 items-center justify-center border shadow-lg p-5 w-1/4 rounded-lg">
      <div className="flex flex-col items-center justify-center">
        <h1 className="font-bold text-2xl text-slate-800">Login to ChatMore</h1>
        <p className="text-slate-500 font-small">All fields are required</p>
      </div>
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            id="email"
            name="email"
            className="focus:border-slate-500 rounded-md px-2 py-1 border border-gray-300 shadow-md"
            value={data.email}
            onChange={handleOnChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="Enter Password"
            id="password"
            name="password"
            className="focus:border-slate-500 rounded-md px-2 py-1 border border-gray-300 shadow-md"
            value={data.password}
            onChange={handleOnChange}
          />
        </div>
        <button className="w-full rounded-lg flex items-center justify-center bg-gradient-to-r from-purple-500 to bg-pink-500 text-white py-2 font-semibold mt-2">
          Login
        </button>
      </form>
      <p className="text-sm font-medium text-gray-700">
        Haven't Registered Yet?{" "}
        <span
          onClick={() => navigate("/register")}
          className="cursor-pointer text-blue-400 underline hover:text-blue-500"
        >
          Register
        </span>
      </p>
    </div>
  );
};

export default Register;
