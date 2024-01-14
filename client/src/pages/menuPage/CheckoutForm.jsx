import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { FaGooglePay } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ price, cart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const user = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [cardError, setCardError] = useState();
  const [clientSecret, setClientSecret] = useState("");
  const isValidEmail = (email) => {
    // You can implement a more comprehensive email validation logic here
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  useEffect(() => {
    if (typeof price !== "number" || price < 1) {
      return;
    }
    axiosSecure.post("/create-payment-intent", { price }).then((res) => {
      console.log(res.data);
      setClientSecret(res.data.clientSecret);
    });
  }, [price, axiosSecure]);

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // create Card Limit
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setCardError(error.message);
    } else {
      setCardError("Succes");
      console.log("[PaymentMethod]", paymentMethod);
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: user.user?.displayName || "anonymous",
            email: isValidEmail(user?.email)
              ? user.user?.email
              : "unknown@example.com",
          },
        },
      });
    console.log(clientSecret);
    if (confirmError) {
      console.log(confirmError);
    }
    console.log(paymentIntent);
    if (paymentIntent.status === "succeeded") {
      console.log(paymentIntent.id);
      setCardError(`Your transactionId is ${paymentIntent.id}`);

      //  payment info data
      const paymentInfo = {
        email: user.user.email,
        transactionId: paymentIntent.id,
        price,
        quantity: cart.length,
        status: "order pending",
        itemName: cart.map((item) => item.name),
        cartItems: cart.map((item) => item._id),
        menuItems: cart.map((item) => item.menuItemId),
      };

      console.log(paymentInfo);
      //  sendInformation To Backend
      axiosSecure.post("/payments", paymentInfo).then((res) => {
        console.log(res.data);
        alert("Successfull Payment");
      });
    }
  };
  return (
    <div className="flex flex-col sm:flex-row justify-start items-start gap-8">
      {/* left side */}
      <div className="md:w-1/2 w-full space-y-3">
        <h4 className="text-lg font-semibold">Order Summary</h4>
        <p>Total Price: Rs.{price}</p>
        <p>Number of Items: {cart.length}</p>
      </div>
      {/* Right Side */}
      <div className="md:w-1/2  space-y-5 card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 px-4 py-4">
        <h4 className="text-lg font-semibold">Progress your Payment!</h4>
        <h5 className="font-medium">Credit/Debit Card</h5>
        {/* Stripe Form */}
        <form onSubmit={handleSubmit}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
          <button
            type="submit"
            disabled={!stripe}
            className="btn btn-sm mt-5 btn-primary w-full text-white "
          >
            Pay
          </button>
        </form>
        {cardError ? (
          <p className="text-red italic text-xs">{cardError}</p>
        ) : (
          ""
        )}
        {/* paypal */}
        <div className="mt-5 text-center">
          <hr />
          <button
            type="submit"
            className="btn btn-sm mt-5 bg-orange-500  text-white"
          >
            <FaGooglePay />
            Pay With GooglePay
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
