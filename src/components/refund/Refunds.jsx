'use client';

export default function Refunds() {
  return (
    <div className="bg-white text-black p-4 sm:p-6 md:p-8 overflow-hidden min-h-screen">
      
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold border-l-4 border-red-600 pl-3 mb-6 sm:mb-8 mt-[-7px] -ml-2 text-[#2c2c2c]">
        Refunds
      </h1>

      {/* Refund Application Form */}
   
<div className="bg-white rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] mb-6 sm:mb-10 w-full max-w-3xl">

        {/* Header */}
        <div className="bg-[#A4B494] rounded-t-lg sm:rounded-t-xl px-6 py-3 font-bold text-base md:text-lg">
          Refund Application Form
        </div>

        <form className="space-y-4 px-6 py-6">
          {/* Refund Type */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-800">
              Refund Type
            </label>
            <select className="w-full px-4 py-2 rounded-md shadow-md border border-gray-300 text-sm">
              <option value="">Select Refund Type</option>
              <option>Mess fee Overpayment</option>
              <option>Security Deposit</option>
              <option>Damages fee</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-800">
              Amount
            </label>
            <input
              type="number"
              placeholder="Enter the Amount"
              className="w-full px-4 py-2 rounded-md shadow-md border border-gray-300 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Reason */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <label className="text-xs sm:text-sm font-semibold sm:pt-2 whitespace-nowrap">
              Reason For Refund:
            </label>
            <textarea 
              className="w-full px-3 sm:px-4 py-2 rounded-lg shadow-md h-16 sm:h-20 resize-none border border-gray-300 text-xs"
              placeholder="Enter the reason for refund"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="bg-[#A4AE97] text-black px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 rounded-md shadow hover:opacity-90 text-xs sm:text-sm font-medium w-full sm:w-auto"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Refund History */}
      <div className="bg-white min-h-[280px] sm:min-h-[340px] rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 w-full max-w-6xl lg:mx-0 lg:ml-0">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
          Refund History
        </h3>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm text-gray-800 min-w-full">
            <thead className="bg-gray-200 text-center">
              <tr>
                <th className="p-3 font-semibold">Refund Type</th>
                <th className="p-3 font-semibold">Requested Date</th>
                <th className="p-3 font-semibold">Amount</th>
                <th className="p-3 font-semibold">Reason</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
             <tr className="bg-white hover:bg-gray-50">

                <td className="p-3 text-center">Mess fee Overpayment</td>
                <td className="p-3 text-center">23-03-2025</td>
                <td className="p-3 text-center">₹50</td>
                <td className="p-3 text-center">Incorrect Calculation</td>
                <td className="p-3 text-center">
                  <span className="bg-green-500 text-black px-2 py-1 rounded-md text-xs font-medium">
                    Approved
                  </span>
                </td>
              </tr>
           <tr className="bg-white hover:bg-gray-50">

                <td className="p-3 text-center">Security Deposit</td>
                <td className="p-3 text-center">23-03-2025</td>
                <td className="p-3 text-center">₹250</td>
                <td className="p-3 text-center">Upon Successful Check-out</td>
                <td className="p-3 text-center">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Rejected
                  </span>
                </td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">

                <td className="p-3 text-center">Damages fee</td>
                <td className="p-3 text-center">23-03-2025</td>
                <td className="p-3 text-center">₹750</td>
                <td className="p-3 text-center">Dispute over Room inspection</td>
                <td className="p-3 text-center">
                  <span className="bg-yellow-400 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-1">
          {/* Card 1 */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
            <div className="flex justify-center items-center mb-2 space-x-2">
              <h4 className="font-semibold text-gray-800 text-xs">Mess fee Overpayment</h4>
              <span className="bg-green-500 text-white px-1.5 py-0.5 rounded text-[10px] font-medium">
                Approved
              </span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-center space-x-1">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-800">23-03-2025</span>
              </div>
              <div className="flex justify-center space-x-1">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-gray-800">₹50</span>
              </div>
              <div className="flex justify-center space-x-1">
                <span className="text-gray-600">Reason:</span>
                <span className="font-medium text-gray-800">Incorrect Calculation</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
            <div className="flex justify-center items-center mb-2 space-x-2">
              <h4 className="font-semibold text-gray-800 text-xs">Security Deposit</h4>
              <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px] font-medium">
                Rejected
              </span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-center space-x-1">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-800">23-03-2025</span>
              </div>
              <div className="flex justify-center space-x-1">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-gray-800">₹250</span>
              </div>
              <div className="flex justify-center space-x-1">
                <span className="text-gray-600">Reason:</span>
                <span className="font-medium text-gray-800">Upon Successful Check-out</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
            <div className="flex justify-center items-center mb-2 space-x-2">
              <h4 className="font-semibold text-gray-800 text-xs">Damages fee</h4>
              <span className="bg-yellow-400 text-black px-1.5 py-0.5 rounded text-[10px] font-medium">
                Pending
              </span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-center space-x-1">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-800">23-03-2025</span>
              </div>
              <div className="flex justify-center space-x-1">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-gray-800">₹750</span>
              </div>
              <div className="flex justify-center space-x-1">
                <span className="text-gray-600">Reason:</span>
                <span className="font-medium text-gray-800">Dispute over Room inspection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
