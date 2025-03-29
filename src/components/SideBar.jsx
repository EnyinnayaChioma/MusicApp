import React from "react";
import overlay from "../assets/overlay.png";
import { Link } from "react-router-dom";

function SideBar() {
  return (
    <>
      <div className=" h-screen w-1/5 flex justify-center fixed inset-0 bg-black md:bg-black z-10 text-white text-xl ">
        <div className=" ">
          <img
            src={overlay}
            alt=""
            className="absolute md:left-0 md:top-[15%] h-[40vh] md:h-[50%] w-full md:w-[40%] object-cover opacity-80"
          />
        </div>
        <ul className="sideBar navitems mt-20 cursor-pointer">
          
          <li className="mb-8 flex hover:bg-[#f59e0b]   rounded-lg p-2">
          
            <i class="fi fi-rs-home"></i>
            <span className="ml-4">Home</span>
           
          </li>
          <li className="mb-8 flex  hover:bg-[#f59e0b]  focus:bg-inherit rounded-lg p-2 " >
            <i class="fi fi-rs-folder-music"></i>
            <span className="ml-4">Library</span>
          </li>
          <li className="mb-8 flex  hover:bg-[#f59e0b]  focus:bg-inherit rounded-lg p-2 ">
            <i class="fi fi-rs-album-collection"></i>
            <span className="ml-4">Album</span>
          </li>
          <li className="mb-8 flex  hover:bg-[#f59e0b]  focus:bg-inherit rounded-lg p-2">
            <i class="fi fi-rs-mouse-pointer-heart"></i>
            <span className="ml-4">Favourite</span>
          </li>
          {/* settings */}
          <div className="setting mt-[30rem] cursor-pointer">
            <li className="mb-8 flex  hover:bg-[#f59e0b]  focus:bg-inherit rounded-lg p-2">
              <i class="fi fi-rs-user-trust"></i>
              <span className="ml-4">Profile</span>
            </li>
            <li className="mb-8 flex  hover:bg-[#f59e0b]  focus:bg-inherit rounded-lg p-2 ">
              <i class="fi fi-rs-settings"></i>
              <span className="ml-4">Setting</span>
            </li>
            <li className="mb-2 flex  hover:bg-[#f59e0b]  focus:bg-inherit rounded-lg p-2 ">
              <i class="fi fi-rs-sign-out-alt"></i>
              <span className="ml-4">Logout</span>
            </li>
          </div>
        </ul>
      </div>
    </>
  );
}

export default SideBar;
