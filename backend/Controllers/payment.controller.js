import * as paymentService from '../Services/razorpay.service.js';





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

export const createContactController = async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      if (!name || !email || !phone) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
      
      const contact = await paymentService.createContact(name, email, phone);
      res.status(201).json({ success: true, contactId: contact.id });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  export const createFundAccountController = async (req, res) => {
    try {
      const { contactId, accountNumber, ifsc, name } = req.body;
      if (!contactId || !accountNumber || !ifsc || !name) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
  
      const fundAccount = await paymentService.createFundAccount(contactId, accountNumber, ifsc, name);
      res.status(201).json({ success: true, fundAccountId: fundAccount.id });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  export const createPayoutController = async (req, res) => {
    try {
      const { fundAccountId, amount } = req.body;
      if (!fundAccountId || !amount) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
  
      const payout = await paymentService.createPayout(fundAccountId, amount);
      res.status(201).json({ success: true, payoutId: payout.id, status: payout.status });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
