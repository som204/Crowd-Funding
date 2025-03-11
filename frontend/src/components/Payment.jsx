import React from "react";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

export const Payment = ({ amount }) => {
  const { error, isLoading, Razorpay } = useRazorpay();
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    const amountInPaise = Math.round(parseFloat(amount) * 100);
    const response = await fetch("http://localhost:3000/payment/create-order", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountInPaise }),
    });
    const { order } = await response.json();

    const options = {
      key: "rzp_test_Su8eWKGlewR4HE",
      amount: amountInPaise,
      currency: "INR",
      name: "Som",
      order_id: order,
      description: "Test Transaction",
      handler: async (response) => {
        const verifyRes = await fetch(
          "http://localhost:3000/payment/verify-payment",
          {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          }
        );
        const verifyData = await verifyRes.json();
        alert(verifyData.message);
      },
      prefill: {
        name: "Your Name",
        email: "youremail@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        type="submit"
        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Back this project
      </button>
    </div>
  );
};
