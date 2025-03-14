import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProjectCard } from "../components/ProjectCard";

export function Discover() {
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:3000/project/all", {
          credentials: "include",
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjectList(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);


  useEffect(() => {
    const loadRazorpayScript = () => {
      if (window.Razorpay) {
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onerror = () => console.error("Failed to load Razorpay.");
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Discover Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectList.map((project) => (
          <Link key={project._id} to={`/project/${project._id}`}>
            <ProjectCard projectid={project._id} />
          </Link>
        ))}
      </div>
    </div>
  );
}
