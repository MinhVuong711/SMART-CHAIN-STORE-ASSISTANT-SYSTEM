const express = require("express");
const app = express();

const customerRoutes = require("./routes/customer.routes");

app.use(express.json());

app.use("/customers", customerRoutes);

app.listen(3004, () => {
    console.log("Customer service running on port 3004");
});