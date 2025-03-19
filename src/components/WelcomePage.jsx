import React from 'react';
import bg from '../assets/group.png';

function WelcomePage() {
  return (
    <>
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black md:bg-black/50 z-10"></div>

      {/* Background image */}
      {/* <div className=" ">
        <img 
          src={bg} 
          alt="" 
          className="absolute md:right-0 md:top-[15%] h-[40vh] md:h-[50%] w-full md:w-[40%] object-cover opacity-80"
        />
      </div> */}

      {/* Content container */}
      <div className="relative flex flex-col items-center justify-center min-h-screen text-white z-20 px-4 py-8">
        <div className="max-w-4xl w-full space-y-8">
          {/* Heading */}
          <div className="w-full md:w-3/4 mx-auto">
            <h1 className='text-3xl md:text-5xl font-bold leading-tight text-center'>
              Dancing Between The Shadow Of Rhythm
            </h1>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button className="w-full md:w-auto px-8 py-4 bg-amber-300 hover:bg-amber-400 text-black font-semibold rounded-full transition-colors duration-300">
              Get Started
            </button>
            <button className="w-full md:w-auto px-8 py-4 border-2 border-white hover:border-amber-300 hover:text-amber-300 rounded-full transition-colors duration-300">
              Continue With Email
            </button>
          </div>

          {/* Agreement */}
          <div className="max-w-xs mx-auto text-sm md:text-base opacity-75 text-center">
            <p>
              By continuing you agree to terms of services and Privacy policy
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default WelcomePage;