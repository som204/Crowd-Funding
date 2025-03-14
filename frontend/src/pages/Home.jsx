import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export function Home() {
  const [allDonations, setAllDonations] = useState([]);
  const [donations, setDonations] = useState([]); // Show donations one by one
  const donationListRef = useRef(null);

  // Fetch donations from API
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch("http://localhost:3000/transaction/getall"); // Replace with your API endpoint
        const data = await response.json();
        setAllDonations(data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, []);

  useEffect(() => {
    let index = 0;

    if (allDonations.length === 0) return; // Prevent execution if no donations

    const interval = setInterval(() => {
      setDonations((prev) => {
        if (index < allDonations.length) {
          return [...prev, allDonations[index++]];
        } else {
          index = 0; // Reset index when all donations are displayed
          return [...prev, allDonations[index++]];
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [allDonations]); // Ensure this runs only when data is available

  // Auto-scroll to the latest donation
  useEffect(() => {
    if (donationListRef.current) {
      donationListRef.current.scrollTop = donationListRef.current.scrollHeight;
    }
  }, [donations]);

  return (
    <div className="relative flex flex-col lg:flex-row items-center justify-between bg-gray-50 px-6 lg:px-12 py-10">
      {/* Left Section */}
      <div className="max-w-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block xl:inline">Bring your creative</span>{" "}
          <span className="block text-indigo-600 xl:inline">projects to life</span>
        </h1>
        <p className="mt-3 text-lg text-gray-600 sm:mt-5 sm:text-xl">
          Join our community of creators and backers. Fund innovative projects,
          support creative ideas, and be part of something amazing.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4">
          <Link to="/start-project" className="px-6 py-3 text-lg font-medium text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 transition">
            Start a Project
          </Link>
          <Link to="/discover" className="mt-3 sm:mt-0 px-6 py-3 text-lg font-medium text-indigo-700 bg-indigo-100 rounded-md shadow-md hover:bg-indigo-200 transition">
            Discover Projects
          </Link>
        </div>
      </div>

      {/* Right Section - Donations Box */}
      <div className="mt-12 lg:mt-0 w-full lg:w-[500px] h-[450px] bg-white/60 backdrop-blur-lg border border-gray-300 rounded-2xl shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-indigo-700">Recent Donations</h2>
        <p className="text-gray-600 text-sm">Live updates on donations across the platform.</p>

        {/* Scrollable Donation List */}
        <div ref={donationListRef} className="mt-4 flex-1 overflow-y-auto pr-2 space-y-4" style={{ scrollBehavior: "smooth" }}>
          {donations.length > 0 ? (
            donations.map((donation,index) => (
              <div key={`${donation._id}-${index}`} className="flex flex-col border-b border-gray-300 pb-3">
                <p className="text-indigo-700 font-semibold text-lg">{donation.project_title}</p>
                <p className="text-gray-900 font-bold text-xl">₹{donation.amount}</p>
                <p className="text-gray-500 text-sm">
                  by <span className="font-semibold text-gray-700">{donation.customer_name}</span>
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center mt-10">No donations yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
