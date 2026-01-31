import { Component } from "./ui/vapour-text-effect";
import Globe from "./ui/globe";

const DemoOne = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center bg-black">
      <Component />
      <Globe />
    </div>
  );
};

export { DemoOne };