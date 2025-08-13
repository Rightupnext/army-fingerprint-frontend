import React from "react";
import img1 from './assets/img2.png';
import img2 from './assets/img1.png';
import AddUserForm from "./componenets/AddUserForm";
import ExistingUser from "./componenets/ExistingUser";
import GetAlluserTable from "./componenets/GetAlluserTable";
import BiometricGetUser from "./componenets/BiometricGetUser";

export default function Header({ setActiveTab, activeTab }) {
  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-gray-100 shadow-md">
        {/* Left side logo */}
        <div className="flex items-center">
          <img src={img1} alt="Left Logo" className="h-[100px] w-auto" />
        </div>

        {/* Tabs fill remaining space */}
        <nav className="flex flex-grow justify-center space-x-6 px-8">
          <button
            className={`flex-1 text-center px-4 py-2 rounded-md ${
              activeTab === "tab1" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("tab1")}
          >
            Add User
          </button>
          <button
            className={`flex-1 text-center px-4 py-2 rounded-md ${
              activeTab === "tab2" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("tab2")}
          >
            Existing User
          </button>
          <button
            className={`flex-1 text-center px-4 py-2 rounded-md ${
              activeTab === "tab3" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("tab3")}
          >
            User Data
          </button>
        </nav>

        {/* Right side logo */}
        <div className="flex items-center">
          <img src={img2} alt="Right Logo" className="h-[100px] w-auto" />
        </div>
      </header>

      {/* Tab content below header */}
      <div className="w-full mt-4 px-4">
        {activeTab === "tab1" && <AddUserForm />}
        {activeTab === "tab2" && <BiometricGetUser />}
        {activeTab === "tab3" && <GetAlluserTable />}
      </div>
    </>
  );
}
