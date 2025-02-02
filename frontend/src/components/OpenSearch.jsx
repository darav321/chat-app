import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Loader from "./Loader";
import toast from "react-hot-toast";
import axios from "axios";
import SearchUserCard from "./SearchUserCard";
import { IoCloseOutline } from "react-icons/io5";

const OpenSearch = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchUser = async () => {
    const url = `https://chat-app-vuuf.onrender.com/api/user/search`;
    try {
      setLoading(true);
      const response = await axios.post(url, {
        search: search,
      });
      setSearchUser(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [search]);

  console.log(searchUser);
  return (
    <>
      <div className="fixed top-0 right-0 left-0 bottom-0 bg-slate-900 bg-opacity-50 flex flex-col z-10 items-center p-3">
        <div className="bg-white mt-[7rem] px-5 py-2 max-w-md w-full rounded-lg flex flex-col items-center justify-center relative">
          <h1 className="text-3xl font-bold text-slate-700 py-5">Search User</h1>
          <div className=" bg-white w-full max-w-lg h-12 rounded-md flex border border-slate-500">
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full h-full focus:outline-slate-700 px-3 rounded-md border-slate-400"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>

          <div className="max-w-lg w-full bg-white max-h-80 h-80 mt-5 rounded-md overflow-hidden overflow-y-auto scrollbar-hide">
            {searchUser.length === 0 && !loading && (
              <div className="flex items-center justify-center h-full">
                <p className="text-lg font-medium">No Users found!</p>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center h-full">
                <Loader />
              </div>
            )}

            {searchUser.length != 0 &&
              !loading &&
              searchUser.map((user, index) => {
                return <SearchUserCard key={user._id} user={user} />;
              })}
          </div>
          <IoCloseOutline
          className="size-10 absolute rounded-full m-2 cursor-pointer hover:bg-slate-500 hover:text-white hover:ring-2  transition-all duration-150 right-0 top-0"
          onClick={() => onClose()}
          />
        </div>
        
      </div>
    </>
  );
};

export default OpenSearch;
