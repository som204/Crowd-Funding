import Razorpay from 'razorpay';

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
        console.log(error)
        throw new Error(error);
    }
};

export const verifyPayment = (paymentDetails) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);

    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
        return true;
    } else {
        return false;
    }
};

export const fetchPaymentStatus = async (paymentId) => {
    try {
        const payment = await razorpayInstance.payments.fetch(paymentId);
        return payment;
    } catch (error) {
        throw new Error(error);
    }
};

