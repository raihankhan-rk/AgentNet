"use client";

import Icons from "@/assets/Icons";


const EmptyChat = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center font-normal text-[#160211] flex items-center justify-center flex-col gap-6">
        <Icons.logo className="w-12 h-12"/>
        <h3 className="text-3xl font-normal">Ask our AI anything</h3>
        <div className="h-10 rounded-full px-5 border-[1px] border-[#C4CAFF] bg-white flex flex-row items-center justify-between gap-8">
          <h2 className="text-normal font-bold text-[#C4CAFF]"> <span className=" text-[#7B88F9] "> 28 </span> Agents Available</h2>
          <h2 className="text-normal font-bold text-[#C4CAFF]"> <span className=" text-[#7B88F9] "> 46k/hr </span> Queries</h2>
          <h2 className="text-normal font-bold text-[#C4CAFF]"> <span className=" text-[#7B88F9] "> 26k/hr </span> Actions</h2>
        </div>
      </div>
    </div>
  );
};

export default EmptyChat; 