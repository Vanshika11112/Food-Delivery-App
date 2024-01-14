const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6001;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// middleware
app.use(cors());
app.use(express.json());

// mongodb configuration using mongoose

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2cxavoy.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(console.log("MongoDB Connected Successfully!"))
  .catch((error) => console.log("Error connecting to MongoDB", error));

// jwt authentication
app.post("/jwt", (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1hr",
  });
  res.send({ token });
});

//  Verify Jwt token
//  middleware

//   import routes here
const menuRoutes = require("./routes/menuRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const verifyToken = require("./middleware/verifyToken.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
app.use("/menu", menuRoutes);
app.use("/carts", cartRoutes);
app.use("/users", userRoutes);
app.use("/payments", paymentRoutes);

app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = price * 100;

  try {
    // Create a PaymentIntent with the order amount, currency, and description
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",

      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    res.status(500).send({ error: "Error creating PaymentIntent" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello Foodi Client Server!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
