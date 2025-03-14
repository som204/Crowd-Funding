import transactionSchema from '../Models/transaction.model.js'



export const createTransaction= async ({ order_id, payment_id, backer_id, project_id, amount, paymentStatus, reason, description,name,project_title })=>{
    try {
        if(!order_id || !backer_id || !project_id || !amount || !paymentStatus){
            throw new Error("Some Value is Missing");
        }
        const transaction = await transactionSchema.create({
            order_id,
            payment_id,
            backer_id,
            project_id,
            amount,
            status: paymentStatus,
            failure_reason: reason,
            failure_description: description,
            customer_name:name,
            project_title:project_title
        });
        return transaction;
    } catch (error) {
        throw new Error(error);
    }
}


export const getAllTransaction = async ()=>{
    try {
        const data = await transactionSchema.find();
        return data;
    } catch (error) {
        throw new Error(error);
    }
}