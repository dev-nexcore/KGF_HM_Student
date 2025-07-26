'use client';

export default function Refunds() {
  return (
    <div className="py-6">
      <h3 className="text-xl sm:text-2xl font-bold border-l-4 border-red-500 pl-3 mb-5 text-black">
        Refunds
      </h3>

      {/* Refund Form */}
      <div className="w-full max-w-full lg:w-3/4 rounded-[16px] shadow-[0_12px_32px_rgba(0,0,0,0.2)] overflow-hidden mb-10 bg-white ml-0 mr-auto">
        {/* Header */}
        <div className="bg-[#A4AE97] p-4 rounded-t-[16px]">
          <h4 className="text-base sm:text-lg font-bold text-black">Request a Refund</h4>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6">
          <form className="w-full flex flex-col gap-5">
            {/* Refund Type */}
            <div className="w-full">
              <label className="block text-black font-semibold mb-1 text-sm sm:text-base">
                Refund Type
              </label>
              <select className="w-full px-4 py-2 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.2)] bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A4AE97] text-sm">
                <option value="">Choose Refund Type</option>
                <option>Mess fee Overpayment</option>
                <option>Security Deposit</option>
                <option>Damages fee</option>
              </select>
            </div>

            {/* Amount */}
            <div className="w-full">
              <label className="block text-black font-semibold mb-1 text-sm sm:text-base">
                Amount
              </label>
              <input
                type="number"
                placeholder="Enter The Amount"
                className="w-full px-4 py-2 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.2)] placeholder:text-gray-400 text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#A4AE97] text-sm"
              />
            </div>

            {/* Reason For Refund */}
            <div className="w-full flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <label
                htmlFor="reason"
                className="sm:w-[160px] text-black font-semibold pt-2 text-sm sm:text-base"
              >
                Reason For Refund
              </label>
              <textarea
                id="reason"
                rows={4}
                
                className="w-full sm:flex-1 px-4 py-2 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.2)] text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#A4AE97] text-sm"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="w-full flex justify-center">
              <button
                type="submit"
                className="bg-[#A4AE97] text-black px-6 py-2 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.25)] font-semibold hover:bg-[#9aa78f] transition w-full sm:w-auto text-sm"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Refund History */}
      <div className="bg-white rounded-[16px] shadow-[0_6px_20px_rgba(0,0,0,0.25)] w-full overflow-x-auto p-4 sm:p-6">
        <h4 className="text-lg sm:text-xl font-extrabold mb-4 text-black">Refund History</h4>
        <div className="min-w-[600px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#e0e0e0] text-black">
                <th className="px-4 py-3 text-left">Refund Type</th>
                <th className="px-1 py-3 text-left">Requested Date</th>
                <th className="px-1 py-3 text-left">Amount</th>
                <th className="px-12 py-3 text-left">Reason</th>
                <th className="px-10 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-black">
                <td className="px-4 py-4">Mess fee Overpayment</td>
                <td className="px-4 py-4">23-03-2025</td>
                <td className="px-4 py-4">50</td>
                <td className="px-4 py-4">Incorrect Calculation</td>
                <td className="px-4 py-4">
                  <span className="bg-[#39FF14] text-black py-1 px-4 rounded-[4px] font-bold">
                    Approved
                  </span>
                </td>
              </tr>
              <tr className="text-black">
                <td className="px-4 py-4">Security Deposit</td>
                <td className="px-4 py-4">23-03-2025</td>
                <td className="px-4 py-4">250</td>
                <td className="px-4 py-4">Upon Successful Check-out</td>
                <td className="px-4 py-4">
                  <span className="bg-red-500 text-white py-1 px-4 rounded-[4px] font-bold">
                    Rejected
                  </span>
                </td>
              </tr>
              <tr className="text-black">
                <td className="px-4 py-4">Damages fee</td>
                <td className="px-4 py-4">23-03-2025</td>
                <td className="px-4 py-4">750</td>
                <td className="px-4 py-4">Dispute over Room inspection</td>
                <td className="px-4 py-4">
                  <span className="bg-yellow-400 text-white py-1 px-4 rounded-[4px] font-bold">
                    Rejected
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}