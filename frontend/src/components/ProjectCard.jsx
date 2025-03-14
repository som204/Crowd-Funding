import { format } from "date-fns";
import { useEffect, useState } from "react";

export function ProjectCard({ projectid }) {
  const [project, setProject] = useState(null);
  const [closed, setClosed] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(
          `http://localhost:3000/project/projectid/${projectid}`,
          {
            credentials: "include",
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        setClosed(data.closed);
        setPayoutSuccess(data?.payout);
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    }

    fetchProject();
  }, [projectid]);

  if (!project) {
    return <div>Loading...</div>;
  }

  const progress = (project.current_amount / project.goal_amount) * 100;

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Payment & Closed Status Badges */}
      {closed && (
        <>
          {/* Project Closed Label */}
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase rounded-md shadow-md">
            Project Closed
          </div>

          {/* Payment Status Label */}
          <div
            className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase rounded-md shadow-md 
      ${
        payoutSuccess
          ? "bg-green-600 text-white"
          : "bg-yellow-500 text-gray-900"
      }`}
          >
            {payoutSuccess ? "Payment Successful" : "Payment Pending"}
          </div>
        </>
      )}

      {/* Project Image */}
      <img
        src={project.image}
        alt={project.title}
        className={`w-full h-48 object-cover ${closed ? "opacity-50 grayscale" : ""}`}
      />

      {/* Project Details */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{project.description}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${closed ? "bg-gray-400" : "bg-green-600"}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>₹{project.current_amount.toLocaleString("hi-IN")}</span>
            <span>
              {Math.round(progress)}% of ₹{project.goal_amount.toLocaleString("hi-IN")}
            </span>
          </div>
        </div>

        {/* Footer Details */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{format(new Date(project.end_at), "MMM dd, yyyy")}</span>
          <span>{project.backer_count} backers</span>
        </div>
      </div>
    </div>
  );
}
