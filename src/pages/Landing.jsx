import React from 'react';
import { Button } from '../components';
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full font-sans">
      {/* Hero Section */}
      <div
        className="w-full h-[500px] bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
        style={{ backgroundImage: "url('/landing.png')" }}
      >
        <h1 className="text-5xl font-serif font-bold text-black mb-4">CookFlow</h1>
        <p className="text-lg text-black mb-6">Rediscover the pleasure of cooking</p>
        <Link to="/signup">
  <Button>Empezar →</Button>
</Link>
      </div>

      {/* Problem Section */}
      <div className="bg-[#e9e6d7] w-full py-16 text-center">
        <h2 className="text-2xl font-semibold mb-12">From frustration to enjoyment</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-4 px-4">
          {/* Box 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto">
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-semibold text-lg mb-2">What to cook today?</h3>
            <p className="text-gray-600 text-sm">
              The daily decision fatigue that creates stress and frustration when planning your meals
            </p>
          </div>
          {/* Box 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto">
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-semibold text-lg mb-2">No time or organization</h3>
            <p className="text-gray-600 text-sm">
              Lost recipes, improvised shopping, and the stress of cooking without a clear plan
            </p>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="bg-[#fdf2f2] w-full py-16 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">The CookFlow solution</h2>
        <p className="max-w-2xl mx-auto text-gray-700 mb-8 text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
          et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <Link to="/signup">
  <Button>A cocinar</Button>
</Link>
      </div>
    </div>
  );
};

export default Landing;
