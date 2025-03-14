import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clipboard, Calendar, CheckCircle } from "lucide-react";

const PledgeCard = ({ pledge }) => {
  return (
    <Card className="w-full max-w-lg md:w-[400px] h-auto md:h-52 shadow-lg border border-gray-300 rounded-xl hover:shadow-xl transition-all duration-300">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-black truncate">{pledge.project_title}</h2>
          {pledge.status === true ? (<Badge className="bg-green-500 text-white text-xs">Successful</Badge>) : (<Badge className="bg-red-500 text-white text-xs">Failed</Badge>)}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clipboard className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-black">
              Order ID: <span className="font-semibold text-base">{pledge.order_id}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-black">
              Payment ID: <span className="font-semibold text-base">{pledge.payment_id}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-black">
              Backed At: <span className="font-semibold">{new Date(pledge.created_at).toLocaleString("hi-IN")}</span>
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">₹{pledge.amount}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PledgeCard;
