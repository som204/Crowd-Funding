import mongoose from "mongoose";
import * as paymentService from '../Services/razorpay.service.js';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  goal_amount: { type: Number, required: true },
  current_amount: { type: Number, default: 0 },
  backer_count: { type: Number, default: 0 },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  end_at: { type: Date, required: true },
  image: { type: String },
  created_by: { type: String, required: true },
  closed: { type: Boolean, default: false },
  bank_details: {
    account_number: { type: String, required: true },
    ifsc_code: { type: String, required: true },
    account_holder_name: { type: String, required: true },
  },
  payout: { type: Boolean, default: false },
  fund_account_id: { type: String, required: true },
  category: { type: String, required: true }
});

ProjectSchema.methods.checkProjectStatus = async function () {
  const now = new Date();
  if (this.current_amount >= this.goal_amount || now >= this.end_at) {
    this.closed = true;
    try {
      const payoutResponse = await paymentService.createPayout(this.fund_account_id, this.current_amount);
      if (payoutResponse && payoutResponse.id) {
        this.payout = true; // Mark payout as completed
        await this.save(); // Save updated project
        console.log("Payout successful:", payoutResponse);
      }
    } catch (error) {
      console.error(" Payout failed:", error);
    }
  }
};

export default mongoose.model("projects", ProjectSchema);
