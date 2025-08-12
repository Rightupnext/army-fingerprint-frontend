import React, { useState, useEffect } from "react";
import axios from "axios";

function GetAlluserTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:5000/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter((user) =>
    [user.firstName, user.lastName, user.email]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const [displayCount, setDisplayCount] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / displayCount);

  // Paginate users for current page
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * displayCount,
    currentPage * displayCount
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [displayCount]);

  // Helper to create page buttons dynamically
  const renderPageButtons = () => {
    let buttons = [];

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <li
          key={i}
          className={`flex items-center justify-center w-9 h-9 rounded-md cursor-pointer ${
            currentPage === i
              ? "bg-blue-500 text-white border border-blue-500"
              : "bg-gray-100 text-slate-900 border border-gray-300 hover:border-blue-500"
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </li>
      );
    }

    return buttons;
  };
  return (
    <div className="mx-[30px]">
      <h2 className="title">Search Here</h2>
      <div className="flex px-4 py-3 rounded-md border-2 border-blue-500 overflow-hidden max-w-md ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 192.904 192.904"
          width="16px"
          className="fill-gray-600 mr-3 rotate-90"
        >
          <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="email"
          placeholder="Search Something..."
          className="w-full outline-none bg-transparent text-gray-600 text-sm"
        />
      </div>

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 whitespace-nowrap">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  <div className="flex items-center">First Name</div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  <div className="flex items-center">Last Name</div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  <div className="flex items-center">Email</div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  <div className="flex items-center">Phone</div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  <div className="flex items-center">RollNo</div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 fill-gray-500 inline mr-2"
                      viewBox="0 0 24 24"
                    >
                      <g transform="matrix(1.05 0 0 1.05 -.6 -.6)">
                        <path
                          d="M19 22.75H5c-2.07 0-3.75-1.68-3.75-3.75V7c0-2.07 1.68-3.75 3.75-3.75h14c2.07 0 3.75 1.68 3.75 3.75v12c0 2.07-1.68 3.75-3.75 3.75zm-14-18C3.76 4.75 2.75 5.76 2.75 7v12c0 1.24 1.01 2.25 2.25 2.25h14c1.24 0 2.25-1.01 2.25-2.25V7c0-1.24-1.01-2.25-2.25-2.25z"
                          data-original="#000000"
                        />
                        <path
                          d="M22 9.75H2c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h20c.41 0 .75.34.75.75s-.34.75-.75.75zm-5-5c-.41 0-.75-.34-.75-.75V2c0-.41.34-.75.75-.75s.75.34.75.75v2c0 .41-.34.75-.75.75zm-10 0c-.41 0-.75-.34-.75-.75V2c0-.41.34-.75.75-.75s.75.34.75.75v2c0 .41-.34.75-.75.75z"
                          data-original="#000000"
                        />
                        <circle cx={7} cy={13} r={1} data-original="#000000" />
                        <circle cx={12} cy={13} r={1} data-original="#000000" />
                        <circle cx={17} cy={13} r={1} data-original="#000000" />
                        <circle cx={7} cy={18} r={1} data-original="#000000" />
                        <circle cx={12} cy={18} r={1} data-original="#000000" />
                        <circle cx={17} cy={18} r={1} data-original="#000000" />
                      </g>
                    </svg>
                    Created At
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 fill-gray-500 inline mr-2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 23.5C5.675 23.5.5 18.325.5 12S5.675.5 12 .5c.69 0 1.15.46 1.15 1.15S12.69 2.8 12 2.8c-5.06 0-9.2 4.14-9.2 9.2s4.14 9.2 9.2 9.2 9.2-4.14 9.2-9.2c0-.69.46-1.15 1.15-1.15s1.15.46 1.15 1.15c0 6.325-5.175 11.5-11.5 11.5z"
                        data-original="#000000"
                      />
                      <path
                        d="M12 18.325c-3.45 0-6.325-2.875-6.325-6.325S8.55 5.675 12 5.675c.69 0 1.15.46 1.15 1.15s-.46 1.15-1.15 1.15c-2.185 0-4.025 1.84-4.025 4.025s1.84 4.025 4.025 4.025 4.025-1.84 4.025-4.025c0-.69.46-1.15 1.15-1.15s1.15.46 1.15 1.15c0 3.45-2.875 6.325-6.325 6.325z"
                        data-original="#000000"
                      />
                      <path
                        d="M12 13.15c-.345 0-.575-.115-.805-.345-.46-.46-.46-1.15 0-1.61l3.68-3.68c.46-.46 1.15-.46 1.61 0s.46 1.15 0 1.61l-3.565 3.68c-.345.23-.575.345-.92.345z"
                        data-original="#000000"
                      />
                      <path
                        d="M19.245 9.585h-3.68c-.69 0-1.15-.46-1.15-1.15v-3.68c0-.345.115-.575.345-.805L17.865.845c.345-.345.805-.46 1.265-.23s.69.575.69 1.035v2.415h2.53c.46 0 .92.23 1.035.69.23.46.115.92-.23 1.265L20.05 9.24c-.23.115-.46.345-.805.345zm-2.53-2.3h1.955l.805-.805h-.805c-.69 0-1.15-.46-1.15-1.15v-.92l-.805.805z"
                        data-original="#000000"
                      />
                    </svg>
                    Action
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="noUsers">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 text-sm text-slate-900 font-medium">
                      <div className="flex items-center cursor-pointer w-max">
                        <div className="ml-2">
                          <p>{user.firstName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-medium">
                      {user.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-medium">
                      <a href={`mailto:${user.email}`} className="underline">
                        {user.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-medium">
                      {user.mobileNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-medium">
                      {user.rollNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-medium">
                      {new Date(user.created_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="flex gap-3 px-4 py-3 text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(user)}
                        className="flex items-center gap-2 rounded-lg text-blue-600 bg-blue-50 border border-gray-200 px-3 py-1 cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-2 rounded-lg text-red-600 bg-red-50 border border-gray-200 px-3 py-1 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="md:flex m-4">
            <p className="text-sm text-slate-600 flex-1">
              Showing {(currentPage - 1) * displayCount + 1} to{" "}
              {Math.min(currentPage * displayCount, filteredUsers.length)} of{" "}
              {filteredUsers.length} entries
            </p>
            <div className="flex items-center max-md:mt-4">
              <p className="text-sm text-slate-600">Display</p>
              <select
                className="text-sm text-slate-900 border border-gray-300 rounded-md h-9 mx-4 px-1 outline-none"
                onChange={(e) => setDisplayCount(Number(e.target.value))}
                value={displayCount}
              >
                {[12, 20, 50, 100].map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
              <ul className="flex space-x-3 justify-center">
                {renderPageButtons()}
              </ul>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div
          className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-lg p-6 w-[900px] h-[700px] overflow-scroll shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition float-end cursor-pointer"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
            <h3 className="text-xl font-semibold mb-4">
              {selectedUser.firstName} {selectedUser.lastName} - Details
            </h3>

            {/* User photo */}
            {selectedUser.photo && (
              <img
                src={`http://127.0.0.1:5000/uploads/${selectedUser.photo}`}
                alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                className="max-w-[150px] mb-4 rounded-lg mx-auto"
              />
            )}

            {/* Finger template photo */}
            {selectedUser.finger_Template_idfinger_Template_id && (
              <img
                src={`http://127.0.0.1:5000/dataset/${selectedUser.finger_Template_idfinger_Template_id}`}
                alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                className="max-w-[150px] mb-4 rounded-lg mx-auto"
              />
            )}

            <table className="w-full text-left border-collapse">
              <tbody>
                {Object.entries(selectedUser).map(([key, val]) =>
                  key === "photo" ? null : (
                    <tr key={key} className="border-b last:border-b-0">
                      <td className="py-2 pr-4 font-medium capitalize">
                        {key.replace(/_/g, " ")}
                      </td>
                      <td className="py-2">
                        {val === null ? "N/A" : val.toString()}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
function renderPageButtons() {
  let buttons = [];

  for (let i = 1; i <= totalPages; i++) {
    buttons.push(
      <li
        key={i}
        className={`flex items-center justify-center w-9 h-9 rounded-md cursor-pointer ${
          currentPage === i
            ? "bg-blue-500 text-white border border-blue-500"
            : "bg-gray-100 text-slate-900 border border-gray-300 hover:border-blue-500"
        }`}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </li>
    );
  }

  return buttons;
}

export default GetAlluserTable;
