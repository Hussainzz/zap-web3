import express, { Express, NextFunction, Request, Response } from "express";
import AppError from "@zap/core/src/utils/appError";
import globalErrorHandler from "@zap/core/src/errorController";
import appUrlMiddleware from "./middleware/appUrlMiddleware";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";
//import xss from "xss-clean";
import http from "http";
import { Server } from "socket.io";
import passportConfig from "./config/passport";

import routes from "./routes";

const app: Express = express();
const server = http.createServer(app);

// declare global {
//   var socketIo: Server
// }

//app.use(xss());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(appUrlMiddleware);

passportConfig(passport);
app.use(passport.initialize());

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    health: 'Zap Events HEALTHY...'
  });
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);


// Socket.io
const ZAP_APP = process.env.ZAP_APP_URL as string;
const ZAP_SOCKET_KEY = 'zap-socket-key'
const socketAllowedHeaders = [ZAP_SOCKET_KEY];
const io = new Server(server, {
  cors: {
    origin: [ZAP_APP, "http://localhost:3000", "http://127.0.0.1:3000"],
    allowedHeaders: socketAllowedHeaders,
    credentials: true
  }
});

io.on('connection', (socket) => {
  const socketKeyHeaderValue = socket.handshake.headers[ZAP_SOCKET_KEY] ?? null;
  if (socketKeyHeaderValue === process.env.ZAP_SOCKET_SECRET) {
    // Accept the connection
    console.log("Zap Socket Connection accepted...", socket?.connected);
  } else {
    // Reject the connection
    console.log("Zap Socket Connection rejected");
    socket.disconnect(true);
  }

  socket.on('disconnect', () =>{
    console.log('Socket disconnected')
  });

});

global.socketIo = io;


export default server;