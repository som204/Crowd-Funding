import * as paymentService from '../Services/payment.service';

export const verifyPayment = async (req, res) => {
    try {
        const paymentDetails = req.body;
        const result = await paymentService.verifyPayment(paymentDetails);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getPaymentStatus = async (req, res) => {
    try {
        const paymentId = req.params.id;
        const status = await paymentService.fetchPaymentStatus(paymentId);
        res.status(200).json({ success: true, data: status });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
