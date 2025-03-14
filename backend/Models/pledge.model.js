import mongoose from "mongoose";

const PledgeSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projects",
    required: true,
  },
  backer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  project_title: { type: String, required: true },
  amount: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  order_id: { type: String, required: true },
  payment_id: { type: String, required: true },
  status:{type:Boolean,required:true}
});

export default mongoose.model("pledges", PledgeSchema);
