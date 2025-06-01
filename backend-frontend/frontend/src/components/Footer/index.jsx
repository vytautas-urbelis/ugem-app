import React from "react";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-white py-12  border-t border-gray-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-gray-900 font-bold mb-4 text-xl">About Us</h3>
            <p className="text-gray-500">
              uGem supports small local businesses by offering tools typically available only to larger companies. At the same time, it empowers people to discover the best local businesses and support them by choosing them over big corporations.
            </p>
          </div>
          <div>
            <h3 className="text-gray-900 font-bold mb-4 text-xl">Quick Links</h3>
            <ul className="text-gray-500">
              <li>
              <Link
                  to="/privacy-policy"
                  className="hover:text-black transition duration-300"
                >
                  Privacy Policy
                </Link>
                {/*<a*/}
                {/*  href="/privacy-policy"*/}
                {/*  className="hover:text-black transition duration-300"*/}
                {/*>*/}
                {/*  Privacy Policy*/}
                {/*</a>*/}
              </li>
              <li>
                {/*<a*/}
                {/*  href="/terms-of-use"*/}
                {/*  className="hover:text-black transition duration-300"*/}
                {/*>*/}
                {/*  Terms Of Service*/}
                {/*</a>*/}
                <Link
                  to="/terms-of-use"
                  className="hover:text-black transition duration-300"
                >
                  Terms Of Service
                </Link>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="hover:text-white transition duration-300"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition duration-300"
                >
                  FAQs
                </a>
              </li> */}
            </ul>
          </div>
          <div>
            <h3 className="text-gray-900 font-bold mb-4 text-xl">Contact Us</h3>
            <p className="text-gray-500">
              Email: team@ugem.app
              {/* <br />
              Phone: +41 000 000 00 00 */}
            </p>
          </div>
          <div>
            <h3 className="text-gray-900 font-bold mb-4 text-xl">Follow Us</h3>
            <div className="flex space-x-4">
              <div className={" bg-gray-100 p-2 rounded-2xl"}>
              <a
                href="https://www.linkedin.com/company/ugem-app/"
                className="text-gray-500 hover:text-black transition duration-300"
              >
                <FaLinkedinIn size={24} />
              </a>
                </div>
              <div className={" bg-gray-100 p-2 rounded-2xl"}>
              <a
                href="https://www.instagram.com/ugem.app/"
                className="text-gray-500 hover:text-black transition duration-300"
              >
                <FaInstagram size={24} />
              </a>
                </div>
              <div className={" bg-gray-100 p-2 rounded-2xl"}>
                <a
                  href="https://www.facebook.com/profile.php?id=61572524675193"
                  className="text-gray-500 hover:text-black transition duration-300"
              >
                <FaFacebookF size={24}/>
              </a>
              </div>

            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-400 pt-8">
          <p className="text-gray-700 text-center">
            &copy; {new Date().getFullYear()} uGem. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
