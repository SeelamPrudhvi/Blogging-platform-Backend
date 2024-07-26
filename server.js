const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

const port = 3001;

// const DB = process.env.DATABASE.replace(
//   "<password>",
//   process.env.DATABASE_PASSWORD
// );
mongoose.connect(process.env.DATABASE).then(() => {
  console.log("DB connection successful");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
