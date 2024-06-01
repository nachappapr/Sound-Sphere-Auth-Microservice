import { app } from "./app";
import { connectDB } from "./utils/connect-db";

// start the server
app.listen(3000, async () => {
  console.log("Auth Server is running on port 3000");
  connectDB()
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
});
