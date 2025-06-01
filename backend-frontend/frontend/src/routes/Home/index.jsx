
import React from "react";
import { Helmet } from "react-helmet";

// Import assets
import HOW_TO from "../../../src/assets/screenshots/how-to.png";
import CAMPAIGNS from "../../../src/assets/screenshots/campaigns.png";
import STAMPS from "../../../src/assets/screenshots/stamps.png";
import PROMOTIONS from "../../../src/assets/screenshots/promotions.png";
import FIND1 from "../../../src/assets/screenshots/find1.png";
import FIND2 from "../../../src/assets/screenshots/find2.png";
import FIND3 from "../../../src/assets/screenshots/find3.png";
import APPSTORE from "../../../src/assets/app-store-badge.svg";
import PLAYSTORE from "../../../src/assets/google-play-badge.png";

const Home = () => {
  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>uGem - Boost Your Small Business with Stamp Cards & Promotions</title>
        <meta
          name="description"
          content="Create custom stamp cards, promotions, and loyalty campaigns to help small businesses grow and keep customers coming back."
        />
        <link rel="canonical" href="https://ugem.app/" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="uGem - Boost Your Small Business with Stamp Cards & Promotions" />
        <meta
          property="og:description"
          content="Create custom stamp cards, promotions, and loyalty campaigns to help small businesses grow and keep customers coming back."
        />
        <meta property="og:image" content="https://ugem.app/ugem.svg" />
        <meta property="og:url" content="https://ugem.app/" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="uGem - Boost Your Small Business with Stamp Cards & Promotions" />
        <meta
          name="twitter:description"
          content="Create custom stamp cards, promotions, and loyalty campaigns to help small businesses grow and keep customers coming back."
        />
        <meta name="twitter:image" content="https://ugem.app/ugem.svg" />

        {/* Structured Data / JSON-LD */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "uGem",
              "url": "https://ugem.app",
              "logo": "https://ugem.app/ugem.svg",
              "description": "Boost Your Small Business with custom stamp cards & promotions."
            }
          `}
        </script>
      </Helmet>

      <main className="bg-gradient-to-b from-amber-50 to-gray-100">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center py-28 px-4 md:px-16 lg:px-32 xl:px-60">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your Customer Engagement
              </h1>
              <p className="text-xl md:text-2xl text-gray-600">
                Create rewarding stamp card campaigns and promotions that keep customers coming back.
              </p>
              <ul>
                <p className="text-base md:text-lg text-gray-800">
                  Only <span className="text-xl md:text-2xl text-gray-700 font-bold"> $7.99 USD</span>  per month or
                  <span className="text-xl md:text-2xl text-gray-700 font-bold"> $69.99 USD</span> annually.
                </p>
                <li className="text-base md:text-lg text-gray-800">
                  Enjoy a <span className="text-xl md:text-2xl text-gray-700 font-bold"> 30-day</span> free
                  trial, and cancel anytime.
                </li>
              </ul>
              <div className="flex flex-row gap-4 mt-8">
                <a
                  href="https://play.google.com/store/apps/details?id=app.ugem"
                  aria-label="Download on Google Play"
                >
                  <img
                    src={PLAYSTORE}
                    alt="Google Play Badge for small business stamp card app"
                    className="h-12 w-auto object-contain"
                  />
                </a>
                <a
                  href="https://apps.apple.com/us/app/ugem/id6739421449"
                  aria-label="Download on the App Store"
                >
                  <img
                    src={APPSTORE}
                    alt="App Store Badge for small business stamp card app"
                    className="h-12 w-auto object-contain"
                  />
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative w-full h-96">
                <div className="absolute top-[-120px] left-36 flex justify-center max-w-96">
                  <img
                    src={STAMPS}
                    alt="Digital stamp card design for customer loyalty"
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Start Section */}
        <section className="py-20 px-4 md:px-16 lg:px-32 xl:px-60 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <img
                src={HOW_TO}
                alt="Promotion examples to grow small business"
                className="rounded-2xl"
              />
            </div>
            <div className="space-y-8">
              {/*<p className="text-2xl md:text-3xl text-amber-600 font-mono">How to start</p>*/}
              {/*<h2 className="text-5xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">*/}
              {/*  How to start*/}
              {/*</h2>*/}
              <h2 className="text-4xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Set up your business profile in just 5 minutes
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-gray-700 font-semibold">
                  Create your business profile either during Sign Up or from your regular uGem account.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Upload your business logo and photos, and update your details.</li>
                  <li>Subscribe to a plan that suits your needs.</li>
                  <li>That’s it! You're all set to go.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Campaigns Section */}
        <section className="py-20 px-4 md:px-16 lg:px-32 xl:px-60 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 order-last lg:order-first">
              {/*<p className="text-2xl md:text-3xl text-amber-600 font-mono">Create campaigns</p>*/}
              {/*<h2 className="text-5xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">*/}
              {/*  Create campaigns*/}
              {/*</h2>*/}
              <h2 className="text-4xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Reward Your Customers with Custom Loyalty Programs
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-gray-700 font-semibold">
                  Choose between two engaging campaign types: Stamp Collections or Point Rewards systems.
                  Perfect for small businesses looking to grow and retain loyal customers.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Set custom reward thresholds for your stamp card</li>
                  <li>Choose from beautiful stamp designs to match your brand</li>
                  <li>Enjoy fully customizable redemption rules</li>
                  <li>Coming soon - real-time activity analytics for better insights</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                  src={CAMPAIGNS}
                  alt="Create Stamp Card Campaign examples for small businesses"
                className="rounded-2xl"
              />
            </div>
          </div>
        </section>

        {/* Promotions Section */}
        <section className="py-20 px-4 md:px-16 lg:px-32 xl:px-60 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <img
                src={PROMOTIONS}
                alt="Promotion examples to grow small business"
                className="rounded-2xl"
              />
            </div>
            <div className="space-y-8">
              {/*<p className="text-2xl md:text-3xl text-amber-600 font-mono">Create Promotion</p>*/}
              {/*<h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">*/}
              {/*  Boost Your Visibility with Time-Limited Offers*/}
              {/*</h2>*/}
              <h2 className="text-4xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Boost Your Visibility with Time-Limited Offers
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-gray-700 font-semibold">
                  Create buzz-worthy promotions that drive foot traffic and new customer acquisition.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Limited quantity vouchers</li>
                  <li>Exclusive offers tailored for loyal customers</li>
                  <li>Automatic redemption tracking for simple management</li>
                  <li>Coming soon - Geofenced notifications for local reach</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Discovery Section */}
        <section className="py-20 px-4 md:px-16 lg:px-32 xl:px-60 bg-white">
          <div className="space-y-16">
            <div className="text-center max-w-3xl mx-auto">
              {/*<p className="text-2xl md:text-3xl text-amber-600 font-mono">How customers find you</p>*/}
              {/*<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">*/}
              {/*  Multiple Pathways to Customer Discovery*/}
              {/*</h2>*/}
              <h2 className="text-4xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Multiple Pathways to Customer Discovery
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  img: FIND1,
                  title: "Direct Search",
                  text: "Customers find you easily through our intuitive home-screen search."
                },
                {
                  img: FIND2,
                  title: "Map Exploration",
                  text: "Local discovery through our interactive map, highlighting your small business location."
                },
                {
                  img: FIND3,
                  title: "App Exploration",
                  text: "Simply by exploring uGem and visiting your business profile."
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={item.img}
                    alt={`${item.title} - ${item.text}`}
                    className="w-full h-96 object-contain mb-6"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 md:px-16 lg:px-32 xl:px-60 bg-amber-50">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Ready to Boost Your Business?
            </h2>
            <p className="text-xl text-gray-600">
              Join our small business community.
            </p>
            <div className="flex flex-row gap-4 justify-center">
              <a
                href="https://play.google.com/store/apps/details?id=app.ugem"
                aria-label="Download on Google Play"
              >
                <img
                  src={PLAYSTORE}
                  alt="Get it on Google Play - stamp card, promotion app"
                  className="h-10 w-auto object-contain"
                />
              </a>
              <a
                href="https://apps.apple.com/us/app/ugem/id6739421449"
                aria-label="Download on the App Store"
              >
                <img
                  src={APPSTORE}
                  alt="Download on App Store - stamp card, promotion app"
                  className="h-10 w-auto object-contain"
                />
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
