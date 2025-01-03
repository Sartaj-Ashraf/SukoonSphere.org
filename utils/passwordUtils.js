import bcrypt from "bcryptjs";
import crypto from "crypto";


export const hashpasword = async (password) =>{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export const comparePassword = async (password, hashedPassword) =>{
    
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch
}

export const hashString = (string) =>
 crypto.createHash("md5").update(string).digest('hex')