import React from "react";
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";

const Avatar = ({ userId, width = 40, height = 40, imageURL, name = "" }) => {
  const onlineUser = useSelector((state) => state.user.onlineUser);

  // Extract initials from name
  let avatarName = name
    ? name
        .split(" ")
        .slice(0, 2) // Get first two words
        .map((word) => word[0]?.toUpperCase()) // Take first letter & capitalize
        .join("")
    : "";

  // Check if the user is online
  const isOnline = onlineUser.includes(userId);

  // Avatar colors (Fixed set of 7 colors)
  const bgColors = [
    "bg-orange-500",
    "bg-red-400",
    "bg-green-500",
    "bg-blue-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-cyan-500",
  ];

  // Generate a consistent index from userId or name
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash); // Simple hash function
    }
    return Math.abs(hash); // Ensure positive number
  };

  const colorIndex = userId ? hashCode(userId) % bgColors.length : 0;
  const assignedColor = bgColors[colorIndex];

  return (
    <div className="relative flex items-center justify-center rounded-full" style={{ width, height }}>
      {imageURL ? (
        <img
          src={imageURL}
          alt="User Avatar"
          className="rounded-full object-cover w-full h-full"
        />
      ) : name ? (
        <div
          className={`rounded-full flex items-center justify-center text-white font-medium ${assignedColor}`}
          style={{ width, height }}
        >
          {avatarName}
        </div>
      ) : (
        <PiUserCircle size={width} className="text-gray-500" />
      )}

      {isOnline && (
        <div className="bg-green-500 absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
};

export default Avatar;
