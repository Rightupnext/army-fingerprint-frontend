import React, { useState, useEffect } from "react";
import axios from "axios";
import "../GetAlluserTable.css";

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

  return (
    <div className="container">
      <h2 className="title">User List</h2>

      <input
        type="text"
        placeholder="Search by First Name, Last Name or Email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="searchInput"
      />

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table className="userTable">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Center</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="noUsers">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.mobileNumber}</td>
                  <td>{user.centerName}</td>
                  <td className="actions">
                    <button
                      className="viewButton"
                      onClick={() => setSelectedUser(user)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {selectedUser && (
        <div className="modalOverlay" onClick={() => setSelectedUser(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3 className="modalTitle">
              {selectedUser.firstName} {selectedUser.lastName} - Details
            </h3>
            <table className="modalTable">
              <tbody>
                {Object.entries(selectedUser).map(([key, val]) => (
                  <tr key={key}>
                    <td className="key">{key.replace(/_/g, " ")}</td>
                    <td>{val === null ? "N/A" : val.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="closeButton"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetAlluserTable;
