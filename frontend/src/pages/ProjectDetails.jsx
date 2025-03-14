import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { format } from "date-fns";

export function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingP, setLoadingP] = useState(false);
  const [pledgeAmount, setPledgeAmount] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [closed, setClosed] = useState();
  const processedPaymentIds = new Set();

  useEffect(() => {
    const loadRazorpayScript = () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => console.error("Failed to load Razorpay.");
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []);

  const fetchProject = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/project/projectid/${id}`,
        {
          credentials: "include",
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch project.");
      const data = await response.json();
      setClosed(data.closed);
      setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to make a pledge.");
    if (!razorpayLoaded) return alert("Razorpay is still loading...");

    setLoadingP(true);
    try {
      const amountInPaise = Math.round(parseFloat(pledgeAmount) * 100);

      const response = await fetch(
        "http://localhost:3000/payment/create-order",
        {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amountInPaise }),
        }
      );

      if (!response.ok) throw new Error("Failed to create payment order.");
      const { order } = await response.json();

      const options = {
        key: "rzp_test_Su8eWKGlewR4HE",
        amount: amountInPaise,
        currency: "INR",
        name: "Som",
        order_id: order,
        description: "Project Pledge",
        handler: async (response) => {
          //console.log(response)
          alert("Payment Successful!");
          await handlePledge(order.id, response.razorpay_payment_id, true);
          setLoadingP(false);
          fetchProject();
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile,
        },
        theme: { color: "#3399cc" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.off("payment.failed");
      paymentObject.on("payment.failed", async (response) => {
        const failedPaymentId = response.error.metadata.payment_id;
        const failedReason = response.error.reason;
        const failedDescription = response.error.description;
        if (!processedPaymentIds.has(failedPaymentId)) {
          processedPaymentIds.add(failedPaymentId);
          alert("Payment Failed.");
          await handlePledge(
            order.id,
            failedPaymentId,
            false,
            failedReason,
            failedDescription
          );
        }
      });
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoadingP(false);
    }
  };

  const handlePledge = async (
    order_id,
    payment_id,
    status,
    reason,
    description
  ) => {
    try {
      const response = await fetch("http://localhost:3000/pledge/create", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: id,
          backer_id: user._id,
          amount: parseFloat(pledgeAmount),
          project_title: project.title,
          order_id: order_id,
          payment_id: payment_id,
          status: status,
          reason: reason,
          description: description,
          name:user.name,
        }),
      });

      if (!response.ok) throw new Error("Failed to make pledge.");
      const updatedProject = await response.json();
      setPledgeAmount("");
    } catch (error) {
      console.error("Error making pledge:", error);
      alert("Failed to make pledge. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Project not found</h2>
      </div>
    );
  }

  const progress = (project.current_amount / project.goal_amount) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-96 object-cover rounded-lg mb-8"
      />
      <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-600 mb-8">{project.description}</p>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">
            ₹{project.current_amount.toLocaleString()}
            </p>
            <p className="text-gray-600">
              pledged of ₹{project.goal_amount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold">{project.backer_count}</p>
            <p className="text-gray-600">backers</p>
          </div>
          <div>
            <p className="text-3xl font-bold">
              {format(new Date(project.end_at), "MMM dd")}
            </p>
            <p className="text-gray-600">end date</p>
          </div>
        </div>
        {closed ? (
          <p className="w-full text-lg font-semibold text-red-600 text-center bg-red-100 py-3 rounded-md mt-6">
            This project is closed.
          </p>
        ) : (
          user && (
            <form onSubmit={handlePayment} className="mt-6">
              <div className="flex gap-4">
                <input
                  type="number"
                  value={pledgeAmount}
                  onChange={(e) => setPledgeAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1 rounded-md border-gray-300 p-2"
                  min="1"
                  step="0.01"
                  required
                />
                <button
                  type="submit"
                  className={`px-6 py-2 text-white rounded-md ${
                    loadingP
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={loadingP || !razorpayLoaded}
                >
                  {loadingP ? "Processing..." : "Back this project"}
                </button>
              </div>
            </form>
          )
        )}
      </div>
    </div>
  );
}
