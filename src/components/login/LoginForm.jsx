"use client";

export default function Login() {
  return (
    <div className="w-screen min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-full bg-[#A4AE97] p-8 flex flex-col items-center justify-center md:rounded-r-[100px]">
        <h2 className="text-4xl font-extrabold mb-16 text-black text-center">
          Welcome Back!
        </h2>

        <div className="flex items-center justify-center mb-6">
          <div className="bg-white flex items-center justify-center w-52 h-52 md:w-60 md:h-60 rounded-[16px] shadow-lg">
            <img
              src="images/kokan-logo.jpg"
              alt="Kokan Global Foundation"
              className="w-36 h-36 md:w-44 md:h-44 object-contain"
            />
          </div>
        </div>

        <p className="text-center font-semibold text-[15px] text-black mt-6 px-4 leading-6">
          "Manage Your Hostel Smarter – Everything You Need in <br /> One Platform."
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-full bg-white flex flex-col items-center justify-center px-6 md:px-12 py-8 md:py-0">
        <h2 className="text-4xl font-extrabold mb-16 text-black text-center">
          Student Login
        </h2>
        <form className="w-full max-w-sm space-y-6">
          <div>
            <label
              className="block text-[18px] font-semibold text-black mb-2"
              htmlFor="userId"
            >
              User ID
            </label>
            <input
              type="text"
              id="userId"
              placeholder="Enter Your User ID"
              className="w-full p-3 rounded-[13px] border border-gray-200 focus:outline-none focus:ring focus:ring-gray-400 shadow-[0_6px_20px_rgba(0,0,0,0.25)] placeholder:text-gray-400"
            />
          </div>
          <div>
            <label
              className="block text-[18px] font-semibold text-black mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter Your Password"
              className="w-full p-3 rounded-[13px] border border-gray-200 focus:outline-none focus:ring focus:ring-gray-400 shadow-[0_6px_20px_rgba(0,0,0,0.25)] placeholder:text-gray-400"
            />
          </div>
          <div className="flex justify-end">
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forget Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-[13px] bg-[#A4AE97] text-black font-semibold text-[20px] shadow hover:shadow-md transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}