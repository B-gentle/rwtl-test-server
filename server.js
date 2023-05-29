const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
<<<<<<< HEAD
const cookieParser = require("cookie-parser");
=======
>>>>>>> aea19527c23a6ed16779e6d24400132df6ff2d08
const packageRoute = require("./routes/packageRoute");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleWare/errorMiddleware");


const app = express();

//middlewares
app.use(express.json());
<<<<<<< HEAD
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));
app.use(cookieParser());
=======
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
>>>>>>> aea19527c23a6ed16779e6d24400132df6ff2d08

//Routes Middleware
app.use("/api/packages", packageRoute)
app.use("/api/users", userRoute)

<<<<<<< HEAD
//Error MiddleWare
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(PORT, () => console.log(`Server running on Port ${PORT}`))
}).catch((err => console.log(err)));
=======
//Routes
app.get("/login", (req, res) => {
    res.send("login page")
})


// Register errorHandler middleware
app.use((err, req, res, next) => {
    errorHandler(err, req, res, next);
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on Port ${PORT}`))
    }).catch((err => console.log(err)));
>>>>>>> aea19527c23a6ed16779e6d24400132df6ff2d08
