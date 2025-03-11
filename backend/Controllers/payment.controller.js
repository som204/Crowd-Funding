import * as paymentService from '../Services/razorpay.service.js';

export const verifyPayment = async (req, res) => {
    try {
        const paymentDetails = req.body;
        const result = await paymentService.verifyPayment(paymentDetails);
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(500).json({  message: error.message });
    }
};

export const getPaymentStatus = async (req, res) => {
    try {
        const paymentId = req.params.id;
        const status = await paymentService.fetchPaymentStatus(paymentId);
        res.status(200).json({ success: status, data: status });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createOrder = async (req, res) => {
    try {
        const orderDetails = req.body;
        const order = await paymentService.createOrder(orderDetails);
        res.status(201).json({ success: true, order });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
};
