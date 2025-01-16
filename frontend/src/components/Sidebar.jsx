import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import { GoArrowUpLeft } from "react-icons/go";
import OpenSearch from "./OpenSearch";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import moment from "moment";
import { logOut } from "../../redux/userSlice";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Loader from "./Loader";

const Sidebar = () => {
  const user = useSelector((state) => state.user);
  const [editUserDetails, setEditUserDetails] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [openSearchUser, setOpenSearhcUser] = useState(false);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  const [userDetails, setUserDetails] = useState({
    email: "",
    name: "",
    profilePic: "",
  });

  const handleLogOut = () => {
    toast((t) => (
      <div className="flex justify-center items-center flex-col gap-3">
        <p className="font-medium text-lg">Are you sure you want to logout?</p>
        <div className="flex flex-row gap-3 items-center">
          <button
            className="bg-green-500 rounded-lg px-3 py-2 text-white font-medium"
            onClick={() => {
              toast.dismiss(t.id);
              const response = axios("http://localhost:5000/api/user/logout", {
                method: "post",
                withCredentials: true,
              });
              dispatch(logOut(user));
              localStorage.removeItem("token");
              sessionStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Yes
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id)
            }}
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);

      socketConnection.on("side", (data) => {

        const conversationUserData = data.map((conversationUser, index) => {
          if (
            conversationUser?.sender?._id === conversationUser?.reciever?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.reciever?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.reciever,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });
        setLoading(true);
        setAllUsers(conversationUserData);
        setLoading(false)
      });
    }
  }, [socketConnection, user]);

  return (
    <div className="flex flex-row">
      <div className="bg-[#9333ea] shadow-lg pr-2 h-screen text-white  py-12 flex items-start justify-between flex-col pl-2 gap-5">
        <div className="flex flex-col gap-3">
          <NavLink
            title="chat"
            className={({ isActive }) =>
              `w-9 h-9 flex items-center justify-center cursor-pointer rounded-full transition duration-150 ${
                isActive && "ring-2 ring-white "
              }`
            }
          >
            <IoChatbubbleEllipses className="w-6 h-6" />
          </NavLink>

          <div className="w-9 h-9 flex items-center justify-center cursor-pointer text-white hover:ring-2 hover:ring-white rounded-full transition duration-150">
            <FaUserPlus
              onClick={() => setOpenSearhcUser(true)}
              className="w-6 h-6"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 items-center">
          <div
            title="Logout"
            onClick={handleLogOut}
            className="w-9 h-9 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-white rounded-full transition duration-150"
          >
            <IoIosLogOut className="w-6 h-6 text-white font-bold text-lg" />
          </div>
          <div
            onClick={() => setEditUserDetails(true)}
            title="Profile"
            className="w-9 h-9 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-white rounded-full transition duration-150"
          >
            <Avatar
              width={25}
              height={25}
              name={user.name}
              imageURL={user.profilePic}
              userId={user._id}
            />
          </div>
        </div>
      </div>
      <div className="w-full h-screen">
        <div className="h-16 bg-wh ite flex items-center justify-center">
          <h1 className="text-xl font-semibold ">Messages</h1>
        </div>
        <div className="bg-gray-400 p-[0.5px]"></div>

        <div>
          {allUsers.length === 0 && loading === true && (
            <div className="flex flex-col items-center mt-20 gap-3">
              <div className="text-slate-600">
                <GoArrowUpLeft size={50} />
              </div>
              <div>
                <p className="text-xl text-center text-slate-500">
                  Explore users to
                </p>
                <p className="text-xl text-center text-slate-500">
                  start Conversation
                </p>
              </div>
            </div>
          )}
          <div className="top-10 left-30">
          {
            loading && (
              <Loader />
            )
          }
          </div>
          {allUsers.map((sideUser, index) => (
            <>
              <NavLink
                to={"/" + sideUser.userDetails._id}
                className="flex justify-between items-center px-4 hover:bg-violet-200 hover:border-1 cursor-pointer hover:border-violet-500"
              >
                <div key={sideUser._id} className="flex flex-row gap-2 py-4">
                  <div className="">
                    {
                      <Avatar
                        imageURL={sideUser.userDetails.profilePic}
                        name={sideUser.userDetails.name}
                        width={45}
                        height={45}
                      />
                    }
                  </div>
                  <div className="flex flex-col ">
                    <p className="text-ellipsis line-clamp-1 text-lg font-medium">
                      {sideUser.userDetails.name}
                    </p>
                    <div className="flex flex-row items-center text-slate-700 gap-1">
                      <div>
                        {sideUser.lastMsg.msgByUserId === user._id && (
                          <p>You:</p>
                        )}
                      </div>
                      <div>
                        {sideUser.lastMsg.imageUrl && (
                          <MdOutlinePhotoSizeSelectActual size={18} />
                        )}
                      </div>

                      <div>
                        {sideUser.lastMsg.text.length < 12 ? (
                          <p>{sideUser.lastMsg.text}</p>
                        ) : (
                          <p>`{sideUser.lastMsg.text.substr(0, 8)}...`</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center mt-1">
                  <div className="text-xs mb-2 font-medium">
                    {moment(sideUser.lastMsg.createdAt).format("hh:mm A")}
                  </div>
                  <div
                    className={`bg-violet-400 w-7 text-sm text-white ml-6 h-7 flex items-center justify-center rounded-full ${
                      sideUser.unseenMsg === 0 && "hidden"
                    }`}
                  >
                    {sideUser.unseenMsg !== 0 && sideUser.unseenMsg}
                  </div>
                </div>
              </NavLink>
              <div className="bg-gray-300 p-[0.5px]"></div>
            </>
          ))}
        </div>
      </div>
      {editUserDetails && (
        <EditUserDetails
          onClose={() => setEditUserDetails(false)}
          user={user}
        />
      )}

      {openSearchUser && (
        <OpenSearch onClose={() => setOpenSearhcUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
