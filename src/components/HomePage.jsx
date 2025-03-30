import React from "react";
import overlay from "../assets/overlay.png";
import User from "../assets/user.jpeg";
import SideBar from "./SideBar";
import MusicData from "../data/songData";

function HomePage() {
  return (
    <div className="flex">
      {/* Sidebar - Hidden on mobile, fixed width on desktop */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-20">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-[23rem] min-h-screen bg-black bg-opacity-100">
        {/* Background Overlay */}
        <div className="relative overflow-hidden">
          <img
            src={overlay}
            alt=""
            className="absolute left-0 top-[15%] h-[40vh] w-full opacity-80 
                       md:h-[50%] md:w-[40%] lg:top-[20%]"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10">
          {/* Search Bar */}
          <div className="px-4 mt-8 md:flex md:justify-center">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border rounded-lg md:w-2/3 lg:w-1/2"
            />
          </div>

          {/* Main Content */}
          <div className="text-white mt-8 mx-4 lg:mt-[2rem] lg:mx-[5rem]">
            {/* First Section */}
            <div>
              <div className="mb-8 lg:mb-[2rem]">
                <h1 className="text-2xl font-bold md:text-4xl">
                  New Songs Added
                </h1>
                <p className="text-gray-400">Trending</p>
              </div>

              {/* Song Cards Grid */}
              <div className="grid grid-cols-2 gap-4 md:flex md:flex-wrap md:gap-[2rem]">
                {MusicData.songs.map((song) => (
                  <div key={song.id} className="w-full md:w-[45%] lg:w-[13rem]">
                    <div className="relative">
                      <p className="absolute z-20 text-xl font-bold m-3 md:text-2xl">
                        {song.floatingText}
                      </p>
                      <div className="w-full aspect-square rounded-3xl overflow-hidden">
                        <img
                          src={song.artistPicture}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="mt-4 ml-3">
                      <p className="font-semibold truncate">{song.category}</p>
                      <p className="text-sm text-gray-400 truncate">
                        {song.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Second Section */}
            <div className="mt-12 lg:mt-[5rem]">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {MusicData.songs.map((song) => (
                  <div key={song.id} className="w-full">
                    <div className="aspect-square rounded-xl overflow-hidden">
                      <img
                        src={song.artistPicture}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-2">
                      <p className="font-bold truncate">{song.artist}</p>
                      <p className="text-sm text-gray-400 truncate">
                        {song.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;