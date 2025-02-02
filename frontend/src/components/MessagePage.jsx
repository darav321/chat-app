import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { data, Link, useParams } from "react-router-dom";
import { BsLock, BsThreeDotsVertical } from "react-icons/bs";
import { IoChevronBackOutline } from "react-icons/io5";
import { IoIosAttach } from "react-icons/io";
import Avatar from "./Avatar";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";
import upload from "../../helpers/uploadFile";
import { IoClose } from "react-icons/io5";
import Loader from "./Loader";
import newwall from "../assets/newwall.jpg";
import { IoIosSend } from "react-icons/io";
import moment from "moment";

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const [localSocket, setLocalSocket] = useState(socketConnection);
  const user = useSelector((state) => state.user);
  const [filePop, setFilePop] = useState(false);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profilePic: "",
    online: false,
    _id: "",
  });
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const currentMessage = useRef();

  const handleUplaodImg = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await upload(file);
    setLoading(false);
    setFilePop(false);
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: uploadPhoto.url,
      };
    });
  };

  const handleClearUploadImg = () => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });
  };

  const handleUploadVid = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await upload(file);
    setLoading(false);
    setFilePop(false);
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: uploadPhoto.url,
      };
    });
  };

  const handleClearUploadVid = () => {
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: "",
      };
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new-msg", {
          sender: user._id,
          reciever: params.userid,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user._id,
        });
        setMessage({ text: "", imageUrl: "", videoUrl: "" });
      }
    }
  };

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessages]);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message", params.userid);

      socketConnection.emit("seen", params.userid);

      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });

      socketConnection.on("message", (data) => {
        setAllMessages(data);
      });
    }
  }, [socketConnection, params?.userid, user]);

  return (
    <div>
      <header className="top-0 h-16 bg-slate-100 w-full pt-2 pl-4 flex items-center justify-between pb-2 md:w-full">
        <div className="flex flex-row items-center gap-4 pl-4">
          <Link to={"/"} className="md:hidden pr-5">
            <IoChevronBackOutline size={20} />
          </Link>
          <div>
            <Avatar
              width={30}
              height={30}
              imageURL={dataUser.profilePic}
              name={dataUser.name}
              userId={dataUser._id}
            />
          </div>
          <div>
            <h1 className="font-semibold text-lg my-0">{dataUser.name}</h1>
            <p className="text-sm font-medium -my-1">
              {dataUser.online ? (
                <span className="text-green-500">online</span>
              ) : (
                "offline"
              )}
            </p>
          </div>
        </div>
        <div className="mr-10 cursor-pointer">
          <BsThreeDotsVertical size={20} />
        </div>
      </header>

      <section className="h-[calc(100vh-128px)] overflow-y-scroll scrollbar-hide overflow-x-hidden bg-slate-200">
        <div
          className="flex flex-col gap-2 py-2 mx-2 my-1"
          ref={currentMessage}
        >
          {allMessages.map((msg, index) => {
            const isSent = user._id === msg?.msgByUserId;

            return (
              <div
                key={index}
                className={`flex items-end ${
                  isSent ? "justify-end" : "justify-start"
                }`}
              >
                {/* Timestamp - Outside the message bubble */}
                <p
                  className={`text-[10px] text-gray-500 mb-1 ${
                    isSent ? "mr-2" : "ml-2"
                  }`}
                >
                  {moment(msg.createdAt).format("hh:mm A")}
                </p>

                {/* Message Bubble */}
                <div
                  className={`relative p-3 rounded-2xl shadow-md flex flex-col ${
                    isSent
                      ? "bg-[#9333ea] text-white rounded-tr-none" // Sent Message
                      : "bg-white text-gray-900 rounded-tl-none" // Received Message
                  }`}
                  style={{ maxWidth: "75%", minWidth: "50px" }} // Auto-adjust width
                >
                  {/* Media (Image/Video) */}
                  {msg?.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      className="w-full h-auto max-h-64 rounded-md object-cover mb-1"
                    />
                  )}
                  {msg?.videoUrl && (
                    <video
                      src={msg.videoUrl}
                      className="w-full h-auto max-h-64 rounded-md object-cover mb-1"
                      controls
                    />
                  )}

                  {/* Text Message */}
                  {msg.text && (
                    <p className="px-2 py-1 text-sm break-words">{msg.text}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {message.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadImg}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                alt="uploadImage"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}

        {message.videoUrl && (
          <div
            onClick={handleClearUploadVid}
            className="top-0 right-0 absolute w-fit cursor-pointer hover:bg-white transition duration-150 mt-1 mr-1 rounded-lg"
          >
            <IoClose size={35} />
          </div>
        )}
        {message.videoUrl && (
          <div className="w-full h-full bg-slate-700 bg-opacity-40 flex justify-center items-center rounded overflow-hidden">
            <div className="bg-white p-2">
              <video
                src={message.videoUrl}
                className="aspect-video w-full h-full max-w-sm m-2"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-full">
            <Loader />
          </div>
        )}
      </section>

      <section className="h-16 bg-slate-100 flex items-center px-3 relative">
        <div
          className={`bg-yellow-50 absolute -top-20 flex flex-col rounded-md ${
            !filePop && "hidden"
          }`}
        >
          <form>
            <label
              htmlFor="uploadImg"
              className="flex flex-row gap-2 items-center px-5 py-2 cursor-pointer hover:bg-yellow-100 rounded-t-md"
            >
              <MdOutlinePhotoSizeSelectActual size={15} />
              <p className="text-base font-medium">Photo</p>
            </label>
            <div className="bg-gray-400 p-[0.5px]"></div>
            <label
              htmlFor="uploadVid"
              className="flex flex-row gap-2 items-center px-5 py-2 cursor-pointer hover:bg-yellow-100 rounded-b-md"
            >
              <IoVideocamOutline size={15} />
              <p className="text-base font-medium">Video</p>
            </label>
            <input
              type="file"
              id="uploadImg"
              onChange={handleUplaodImg}
              className="hidden"
            />
            <input
              type="file"
              id="uploadVid"
              onChange={handleUploadVid}
              className="hidden"
            />
          </form>
        </div>
        <div
          onClick={() => setFilePop((prev) => !prev)}
          className="flex items-center justify-center w-16 h-16 cursor-pointer hover:bg-slate-200"
        >
          <IoIosAttach size={29} />
        </div>
        <form className="w-full h-full" onSubmit={handleSendMessage}>
          <div className="w-full h-full flex items-center justify-center">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full h-full py-1 px-2 focus:outline-none bg-transparent"
              value={message.text}
              onChange={(e) => setMessage({ text: e.target.value })}
            />
            <button className="mr-4">
              <IoIosSend size={25} />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
