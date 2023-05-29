const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const packageRoute = require("./routes/packageRoute");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleWare/errorMiddleware");


const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));
app.use(cookieParser());

//Routes Middleware
app.use("/api/packages", packageRoute)
app.use("/api/users", userRoute)

//Error MiddleWare
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(PORT, () => console.log(`Server running on Port ${PORT}`))
}).catch((err => console.log(err)));
