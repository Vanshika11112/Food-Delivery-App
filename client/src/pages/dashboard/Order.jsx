import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const Order = () => {
  const user = useAuth();
  // console.log(user.email)
  const token = localStorage.getItem("access-token");
  console.log(user.user.email);
  const { refetch, data: orders = [] } = useQuery({
    queryKey: ["orders", user.user.email],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:6001/payments?email=${user.user.email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
  });
  // console.log(orders);
  const formDate = (createdAt) => {
    const createdAtDate = new Date(createdAt);
    return createdAtDate.toLocaleDateString();
  };
  return (
    <div className="section-container">
      <div className=" bg-gradient-to-r from-[#FAFAFA] from-0% to-[#FCFCFC] to-100%">
        <div className="py-36 flex flex-col  justify-center items-center gap-8">
          {/* Texts */}
          <div className=" space-y-7 px-4">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              Track All Your
              <span className="text-green"> Orders!</span>
            </h2>
          </div>
        </div>
      </div>
      {orders.length > 0 ? (
        <div>
          <div className="">
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead className="bg-green text-white rounded-sm">
                  <tr>
                    <th>#</th>
                    <th>Order Date</th>
                    <th>transactionId</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{formDate(item.createdAt)}</td>
                      <td className="font-medium">{item.transactionId}</td>
                      <td>Rs.{item.price}</td>
                      <td>{item.status}</td>
                      <Link
                        to="/contact"
                        className="btn btn-sm border-none text-red bg-transparent"
                      >
                        Contact
                      </Link>
                    </tr>
                  ))}
                </tbody>
                {/* foot */}
              </table>
            </div>
          </div>
          <hr />
        </div>
      ) : (
        <div className="text-center mt-20">
          <p>Cart is empty. Please add products.</p>
          <Link to="/menu">
            <button className="btn bg-green text-white mt-3">
              Back to Menu
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Order;
