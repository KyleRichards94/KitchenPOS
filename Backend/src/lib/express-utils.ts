import type { NextFunction, Request, Response } from "express";

/** Express `req.params` values may be `string | string[]`; DB layers typically need a single `string`. */
export function paramString(req: Request, name: string): string | undefined {
    const v = req.params[name];
    if (v === undefined) return undefined;
    return Array.isArray(v) ? v[0] : v;
}

export const asyncHandler =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
        (req: Request, res: Response, next: NextFunction) =>
            fn(req, res, next).catch(next);
