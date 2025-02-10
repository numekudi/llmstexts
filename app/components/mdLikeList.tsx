import React from "react";

const MdLikeList = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full">
      <div className="flex flex-col justify-center items-center">
        <div className="rounded-full bg-gray-500 w-2 h-2"></div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default MdLikeList;
