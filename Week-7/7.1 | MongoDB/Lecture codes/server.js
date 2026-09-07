import app from "./app.js";

import connectDB from "./db.js";

async function startServer() {
  await connectDB();
  app.listen(8080, () => {
    console.log("Server is listening on PORT: 8080");
  });
}

startServer();
