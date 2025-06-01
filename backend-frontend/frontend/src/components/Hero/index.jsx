import AdobeStock_247096725_Preview from "../../assets/AdobeStock_247096725_Preview.jpeg";
import React from "react";

const Hero = () => {
  return (
    <div className="bg-gray-900 py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            One Loyalty Card for <span className="text-orange-400">All</span>{" "}
            Small Businesses
          </h1>
          <p className="text-gray-300 mb-8">
            Attract and retain customers with rewarding campaigns. SwiftyBee
            helps small businesses create loyalty programs that keep customers
            coming back.
          </p>
          <div className="flex">
            <a
              href="/signup"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md mr-4"
            >
              Get Started
            </a>
            <a
              href="/not-found"
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md"
            >
              Live Demo
            </a>
          </div>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <img
            src={AdobeStock_247096725_Preview}
            alt="Hero Illustration"
            className="mx-auto max-w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
