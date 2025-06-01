import React from "react";
import { FaLaptopCode, FaUserFriends, FaAward, FaQrcode } from "react-icons/fa";

const Features = () => {
  return (
    <div className=" py-4 px-4 md:px-16 md:py-16  lg:py-16 lg:px-16 xl:px-16 xl:py-16 ">
      <div className="mx-auto">
        {/* <h2 className="text-4xl text-center mb-12 text-black">
          Key Features
        </h2> */}
        <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-y-4 md:gap-x-4 lg:grid-cols-4 lg:gap-x-4">
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <FaLaptopCode className="text-orange-600 text-4xl" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">
              Create Campaigns
            </h3>
            <p className="text-gray-900 mb-4">
              Small businesses can create rewarding campaigns to attract and
              retain customers.
            </p>
            <a
              href="#"
              className="text-orange-600 font-semibold hover:text-orange-600 transition-colors duration-300"
            >
              Learn More
            </a>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <FaUserFriends className="text-orange-600 text-4xl" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">
              Attract New Customers
            </h3>
            <p className="text-gray-900 mb-4">
              Reach out to new customers with targeted campaigns and promotions.
            </p>
            <a
              href="#"
              className="text-orange-600 font-semibold hover:text-orange-600 transition-colors duration-300"
            >
              Learn More
            </a>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <FaAward className="text-orange-600 text-4xl" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">
              Loyalty Rewards
            </h3>
            <p className="text-gray-900 mb-4">
              Retain loyal customers by offering rewards and incentives.
            </p>
            <a
              href="#"
              className="text-orange-600 font-semibold hover:text-orange-600 transition-colors duration-300"
            >
              Learn More
            </a>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <FaQrcode className="text-orange-600 text-4xl" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">
              Digital Loyalty Card
            </h3>
            <p className="text-gray-9 mb-4">
              Customers can use a single digital loyalty card across multiple
              businesses.
            </p>
            <a
              href="#"
              className="text-orange-600 font-semibold hover:text-orange-600 transition-colors duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
