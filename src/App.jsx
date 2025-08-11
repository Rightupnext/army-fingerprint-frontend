import React, { useState } from "react";

import AddUserForm from "./componenets/AddUserForm";
import Home from "./componenets/Home";
import GetAlluserTable from "./componenets/GetAlluserTable";
import ExistingUser from "./componenets/ExistingUser";
import "../src/Tabs.css";
function App() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div>
      <nav className="tab-nav">
        <button
          className={`tab-button ${activeTab === "tab1" ? "active" : ""}`}
          onClick={() => setActiveTab("tab1")}
        >
          Add User
        </button>
        <button
          className={`tab-button ${activeTab === "tab2" ? "active" : ""}`}
          onClick={() => setActiveTab("tab2")}
        >
          Exisiting User
        </button>
        <button
          className={`tab-button ${activeTab === "tab3" ? "active" : ""}`}
          onClick={() => setActiveTab("tab3")}
        >
          User Data
        </button>
      </nav>

      {activeTab === "tab1" && <AddUserForm />}
      {activeTab === "tab2" && <ExistingUser />}
      {activeTab === "tab3" && <GetAlluserTable />}
    </div>
  );
}

export default App;
