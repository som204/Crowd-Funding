import userModel from '../Models/user.model.js'



export const createUserService = async (email,password,mobile,name,contact_id)=>{
    try {
        if(!email){
            throw new Error("Email is required");
        }
        if(!password){
            throw new Error("Password is required");
        }
        const hashPassword= await userModel.hashPassword(password);
        const newUser= await userModel.create({
            email,
            password:hashPassword,
            mobile,
            name,
            contact_id
        })
        return newUser;
    } catch (error) {
        throw new Error(error.message)
    }
};