import React from "react";
import CreativityContact from "../../Creativity/Contact/Contact";

const Creativity = () => {
  return (
    <>
      <section
        id="creativity"
        className="py-12 sm:py-16 md:py-24 px-4 sm:px-[7vw] md:px-[7vw] lg:px-[20vw] font-sans relative"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-5 grid-rows-5 gap-4">
            <div className="col-span-5 row-span-2 bg-gray-900/60 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(157,0,255,0.4)] transition-all duration-300"></div>
            <div className="col-span-2 row-span-3 row-start-3 bg-gray-900/60 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(157,0,255,0.4)] transition-all duration-300"></div>
            <div className="col-span-3 row-span-3 col-start-3 row-start-3 bg-gray-900/60 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(157,0,255,0.4)] transition-all duration-300"></div>
          </div>
        </div>
      </section>
      <CreativityContact />
    </>
  );
};

export default Creativity;
