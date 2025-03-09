import mongoose from "mongoose";


const PledgeSchema = new mongoose.Schema({
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' ,required: true},
    backer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
    amount: {type:Number,required: true,},
    created_at: { type: Date, default: Date.now },
  });


  export default mongoose.model('pledges', PledgeSchema);