import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createSessionMiddleware } from "./config/session.js";
import { passport } from "./config/passport.js";

import { aiRouter } from "./routes/aiRoutes.js";
import { authRouter } from "./routes/auth.routes.js";
import { userRouter } from "./routes/userRoutes.js";
import { mbtiRouter } from "./routes/mbti.routes.js";
import { chatRouter } from "./routes/chat.routes.js";
import { extraRouter } from "./routes/extra.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(","),
    credentials: true,
  })
);
app.use(express.json());
app.use(
  morgan("dev", {
    skip: () => process.env.NODE_ENV === "test",
  })
);
app.use(createSessionMiddleware());
app.use(passport.initialize());
app.use(passport.session());

// Test route
app.get("/", (req, res) => {
  res.status(200).send("MBTInduce Backend Running");
});

app.use("/auth", authRouter);
app.use("/api/ai", aiRouter);
app.use("/api", userRouter);
app.use("/api/mbti", mbtiRouter);
app.use("/api/chat", chatRouter);
app.use("/api", extraRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };


