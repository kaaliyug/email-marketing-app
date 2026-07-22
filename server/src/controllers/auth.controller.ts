import type { Request, Response } from "express";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { registerUser, loginUser } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler ( async ( req: Request, res: Response) => {

    const parsed = registerSchema.parse( req.body );

    const result = await registerUser( parsed );

    res.status(201).json({
        success: true,
        data: result,
    });
});

export const login = asyncHandler(async ( req: Request, res: Response ) => {

    const parsed = loginSchema.parse( req.body );
    const result = await loginUser(parsed);
    res.json({ success:true, data:result, });
});

export const me = asyncHandler(async (req: Request, res: Response)=>{
    res.json({ success:true, data:req.user });
});




// export const logout = (req, res) => {
//     res.send("Logout");
// };
