import * as transactionService from '../Services/transaction.service.js'



export const createTransactionController= async (req,res)=>{
    try {
        const data=req.body;
        transaction= await transactionService.createTransaction(data);
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllTransactionController = async (req,res)=>{
    try {
        const data = await transactionService.getAllTransaction();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}