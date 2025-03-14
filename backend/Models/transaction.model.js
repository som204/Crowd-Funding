import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    order_id: { type: String, required: true, unique: true }, // Razorpay Order ID
    payment_id: { type: String, unique: true, sparse: true }, // Razorpay Payment ID (null if failed)
    backer_id: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }, // Reference to the user who made the payment
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "projects", required: true }, // Reference to the project
    amount: { type: Number, required: true, min: 1 }, // Transaction amount
    status: { 
      type: String, 
      enum: ["SUCCESS", "FAILED", "PENDING"], 
      default: "PENDING" 
    }, // Transaction status
    failure_reason: { type: String, default: null },
    failure_description: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
    customer_name:{type:String,required:true},
    project_title:{type:String,required:true}
  },
);

const Transaction = mongoose.model("transaction", transactionSchema);
export default Transaction;
