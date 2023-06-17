const dotenv = require("dotenv").config();
const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const packageRoute = require("./routes/packageRoute");
const userRoute = require("./routes/userRoute");
const transactionRoute = require("./routes/transactionRoutes");
const errorHandler = require("./middleWare/errorMiddleware");


const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
// app.use(insertPackages);

app.use(cors({
    origin: ["https://68.183.80.39/", "http://localhost:3000", "http://localhost:3001", "https://myrechargewise.com"],
    credentials: true
}));
app.use(cookieParser());

//Routes Middleware


app.use("/api/packages", packageRoute)
app.use("/api/users", userRoute)
app.use("/api/transaction", transactionRoute);

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//Error MiddleWare
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(PORT, () => console.log(`Server running on Port ${PORT}`))
}).catch((err => console.log(err)));