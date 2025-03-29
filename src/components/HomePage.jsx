import React from "react";
import overlay from "../assets/overlay.png";
import SideBar from "./SideBar";

function HomePage() {
  return (
    <>
      <div className="h-screen ml-[23rem]  w-4/5 bg-slate-300 bg-opacity- fixed inset-0 z-10">
        <div className=" ">
          <img
            src={overlay}
            alt=""
            className="absolute md:left-0 md:top-[15%] h-[40vh] md:h-[50%] w-full md:w-[40%] object-cover opacity-80"
          />
        </div>
       
        <div className="h-screen w-full ">
          <div>
            <SideBar />
          </div>
          {/* Main content area */}
          <div>
            {/* search bar */}
            <div className="flex justify-center mt-8">
              <input
                type="text"
                placeholder="Search..."
                className="w-1/2 p-2 border rounded-lg"
              />
            </div>
          {/* Main content */}
          
          <div className="text-white text-3xl mt-[5rem]">
            <h1>Welcome to the Home Page</h1>
            <p>This is the main content area.</p>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
