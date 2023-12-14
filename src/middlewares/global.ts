import express from 'express';
import compression from 'compression';

// ? compress all responses
export const shouldCompress = (req: express.Request, res: express.Response) => {
  if (req.headers['x-no-compression'] === 'true') {
    // ? don't compress responses with this request header
    return false;
  }

  // ? fallback to standard filter function
  return compression.filter(req, res);
};
