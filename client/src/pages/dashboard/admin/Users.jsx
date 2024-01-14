import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaTrashAlt, FaUser, FaUsers } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
const Users = () => {
  const axiosSecure = useAxiosSecure();
  const { refetch, data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });
  const handleMakeAdmin = (user) => {
    axiosSecure.patch(`/users/admin/${user._id}`).then((res) => {
      alert(`${user.name} is now admin`);
      refetch();
    });
  };
  const handeDeleteUser = (user) => {
    axiosSecure.delete(`/users/${user._id}`).then((res) => {
      alert(`${user.name} is now delete`);
      refetch();
    });
  };
  return (
    <div>
      <div className="flex items:center justify-between m-4">
        <h5>All Users</h5>
        <h5>Total User : {users.length}</h5>
      </div>

      {/* Table */}
      <div>
        <div className="overflow-x-auto">
          <table className="table table-zebra md:w-[870px]">
            {/* head */}
            <thead className="bg-green text-white rounded-lg">
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row */}
              {users.map((item, index) => (
                <tr>
                  <th>{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    {item.role === "admin" ? (
                      "Admin"
                    ) : (
                      <button
                        className="btn btn-xs bg-indigo-500 text-white"
                        onClick={() => handleMakeAdmin(item)}
                      >
                        <FaUsers />
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-xs bg-orange-500 text-white"
                      onClick={() => handeDeleteUser(item)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
