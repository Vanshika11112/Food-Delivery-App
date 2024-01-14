import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckOutForm";
import { loadStripe } from "@stripe/stripe-js";
import useCart from "../../hooks/useCart";

const stripePromise = loadStripe(import.meta.env.VITE_Stripe_Pk);
const Payment = () => {
  const [cart] = useCart();
  console.log(cart);
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  console.log(cartTotal);
  return (
    <div className="section-container py-28">
      <Elements stripe={stripePromise}>
        <CheckoutForm price={cartTotal} cart={cart} />
      </Elements>
    </div>
  );
};

export default Payment;
