import express, { Request, Response, NextFunction } from 'express';
import { AppLogger } from '../core/Logger';
const router = express.Router();

export default router.use((request: Request, _: Response, next: NextFunction)=>{
    AppLogger.info("Request hit at: ", request.url);
    return next();
});