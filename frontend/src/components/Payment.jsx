import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export const Payment = ({ amount }) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

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
      script.onerror = () => console.error("Failed to load Razorpay script.");
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert("Razorpay is still loading, please wait...");
      return;
    }

    setLoading(true);

    try {
      const amountInPaise = Math.round(parseFloat(amount) * 100);
      const response = await fetch(
        "http://localhost:3000/payment/create-order",
        {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amountInPaise }),
        }
      );

      const { order } = await response.json();

      const options = {
        key: "rzp_test_Su8eWKGlewR4HE",
        amount: amountInPaise,
        currency: "INR",
        name: "Som",
        order_id: order,
        description: "Test Transaction",
        handler: function (response) {
          alert("Successful Payment");
          console.log(response);
          setLoading(false);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile,
        },
        theme: { color: "#3399cc" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      paymentObject.on("payment.failed", function (response) {
        console.log(response);
        alert("Payment Failed");
      });
      setLoading(false);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
      setLoading(false); // Hide loader in case of failure
    }
  };


  return (
    <button
      onClick={handlePayment}
      type="submit"
      className={`px-6 py-2 text-white rounded-md ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      }`}
      disabled={loading || !razorpayLoaded}
    >
      {loading ? "Processing..." : "Back this project"}
    </button>
  );
};
