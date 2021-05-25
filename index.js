let express = require("express");
require("dotenv").config({ path: ".env" });
let mongoose = require("mongoose");
let userRouter = require("./routes/userRoutes");

/*Database Connection */
let app = express();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB in the HOUSE!"))
  .catch((er) => {
    console.log(er);
    process.exit(1);
  });

//Middleware

app.use(express.json());

/*API */

//users
app.use("/api/v1/users", userRouter);

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server on Port ${PORT} `));
