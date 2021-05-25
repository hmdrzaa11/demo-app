let express = require("express");
require("dotenv").config({ path: ".env" });
let mongoose = require("mongoose");

/*Database Connection */

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

let app = express();

/*API  */

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server on Port ${PORT} `));
