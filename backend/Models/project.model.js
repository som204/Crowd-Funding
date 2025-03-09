import mongoose from "mongoose";

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
  image : {type: String}
});

export default mongoose.model("projects", ProjectSchema);
