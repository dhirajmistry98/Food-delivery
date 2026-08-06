import  express from "express";
import cors from "cors"
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";


//App config
const app = express()
const port = process.env.PORT || 4002;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, "uploads");

//middleware
app.use(express.json())
app.use(cors())

//db connection
//api endpoints
app.use("/api/food",foodRouter)
app.use("/images", express.static(uploadsPath))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/", (req, res)=> {
  res.send("Api Working")
})

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port,()=>{
      console.log(`Server started on http://localhost:${port}`);
    })
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
