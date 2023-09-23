import express, { NextFunction, Request, Response } from 'express';

export const resolveJSON = (req: Request, res: Response, next: NextFunction) => {
    express.json()(req, res, next);
}

export const resolveRaw = (req: Request, res: Response, next: NextFunction) => {
    express.raw({ type: "text/plain" })(req, res, next);
}