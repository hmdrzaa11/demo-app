let express = require("express");
require("dotenv").config({ path: ".env" });

let app = express();

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server on Port ${PORT} `));
