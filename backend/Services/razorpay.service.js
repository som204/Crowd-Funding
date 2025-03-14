import Razorpay from 'razorpay';
import axios from "axios";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_SECRET;
const BASE_URL = "https://api.razorpay.com/v1";

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});

export const createOrder = async (amount) => {
    const receipt = `orderId_${new Date().getTime()}`;
    const options = {
        amount: amount.amount,
        currency: "INR",
        receipt: receipt,
        payment_capture: 1
    };
    try {
        const order = await razorpayInstance.orders.create(options);
        return order;
    } catch (error) {
        
        throw new Error(error);
    }
};

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")}`
    }
});

// Function to make API requests
const makeRequest = async (url, method, body = null) => {
    try {
        const response = await axiosInstance({
            url,
            method,
            data: body || null
        });

        return response.data;
    } catch (error) {
        console.error(`❌ Error in ${method} request to ${url}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// ✅ Create a Contact
export const createContact = async (name, email, phone) => {
    return await makeRequest("/contacts", "POST", {
        name,
        email,
        contact: phone,
        type: "customer"
    });
};

// ✅ Create a Fund Account
export const createFundAccount = async (contactId, accountNumber, ifsc, name) => {
    return await makeRequest("/fund_accounts", "POST", {
        contact_id: contactId,
        account_type: "bank_account",
        bank_account: { name, ifsc, account_number: accountNumber }
    });
};

// // ✅ Create a Payout
// export const createPayout = async (fundAccountId, amount) => {
//     return await makeRequest("/payouts", "POST", {
//         account_number: "2323230032525252", // Razorpay Virtual Account
//         fund_account_id: fundAccountId,
//         amount: amount * 100, // Convert INR to paise
//         currency: "INR",
//         mode: "IMPS",
//         purpose: "payout",
//         queue_if_low_balance: true
//     });
// };

export const createPayout = async (fundAccountId, amount) => {
    try {
        // Simulating a delay (like real API response)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Return a mock payout response
        return {
            id: `pout_${Math.floor(Math.random() * 100000)}`,
            entity: "payout",
            fund_account_id: fundAccountId,
            amount:amount,
            currency: "INR",
            status: "processed",
            mode: "IMPS",
            purpose: "payout",
            created_at: Date.now(),
        };
    } catch (error) {
        console.error("❌ Error Creating Dummy Payout:", error);
        throw error;
    }
};






