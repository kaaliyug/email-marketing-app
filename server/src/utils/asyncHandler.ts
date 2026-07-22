// import { Request, Response, NextFunction, RequestHandler } from "express";

// export const asyncHandler = (fn: RequestHandler): RequestHandler => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         Promise.resolve(fn(req, res, next)).catch(next);
//     };
// };


import { Request, Response, NextFunction } from "express";

export const asyncHandler = <
    P = any,
    ResBody = any,
    ReqBody = any,
    ReqQuery = any
>(
    fn: (
        req: Request<P, ResBody, ReqBody, ReqQuery>,
        res: Response,
        next: NextFunction
    ) => Promise<any>
) => {
    return (
        req: Request<P, ResBody, ReqBody, ReqQuery>,
        res: Response,
        next: NextFunction
    ) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};