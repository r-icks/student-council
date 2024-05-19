import React, { useState } from "react";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri"; // Importing icons
import { useAppContext } from "../../context/appContext";
import Loading from "../../components/Loading";

const AdminAccountManagement = () => {
  // Hardcoded initial accounts data
  const {
    displayAlert,
    loading,
    addAccount,
    editAccount,
    accountsLoading,
    getAccounts,
    adminAccounts,
    deleteAccount,
  } = useAppContext();

  const [newAccount, setNewAccount] = useState({
    role: "",
    name: "",
    email: "",
    facultyAdvisorEmail: "", // Add facultyAdvisorEmail field
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editAccountId, setEditAccountId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAccount = async () => {
    // Checking if any field is empty
    if (!newAccount.role || !newAccount.name || !newAccount.email) {
      displayAlert({
        alertText: "Please fill all values",
        alertType: "danger",
      });
      return;
    }

    if (newAccount.role === "club" && !newAccount.facultyAdvisorEmail) {
      displayAlert({
        alertText: "Please fill all values",
        alertType: "danger",
      });
      return;
    }

    await addAccount(newAccount);

    // Clearing the form fields
    setNewAccount({
      role: "",
      name: "",
      email: "",
      facultyAdvisorEmail: "",
    });
  };

  const handleEditAccountCall = async () => {
    newAccount.role = "";
    newAccount.facultyAdvisorEmail = "";
    if (!newAccount.name || !newAccount.email) {
      displayAlert({
        alertText: "Please fill all values",
        alertType: "danger",
      });
      return;
    }

    await editAccount({ ...newAccount, accountId: editAccountId });

    setNewAccount({
      role: "",
      name: "",
      email: "",
      facultyAdvisorEmail: "",
    });
  };

  const handleDeleteAccount = async (id) => {
    await deleteAccount({ accountId: id });
  };

  const handleEditAccount = (id) => {
    setEditAccountId(id);
    const accountToEdit = adminAccounts.find((acc) => acc._id === id);
    setNewAccount(accountToEdit);
  };

  const cancelEdit = () => {
    // Clear the edit mode by resetting the editAccountId state
    setEditAccountId(null);

    // Clear the newAccount state
    setNewAccount({
      role: "",
      name: "",
      email: "",
      facultyAdvisorEmail: "", // Clear facultyAdvisorEmail field
    });
  };

  if (!adminAccounts) {
    if (!accountsLoading) {
      getAccounts();
    }
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg">
      <h1 className="text-3xl font-semibold mb-6">Account Management</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Account</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!editAccountId && (
            <div>
              <label className="block mb-2 text-gray-700">User Role</label>
              <select
                name="role"
                value={newAccount.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
              >
                <option value="">Select...</option>
                <option value="sc">Student Council</option>
                <option value="swo">Student Welfare</option>
                <option value="security">Security</option>
                <option value="fa">Faculty Advisor</option>
                <option value="club">Club</option>
              </select>
            </div>
          )}
          <div>
            <label className="block mb-2 text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={newAccount.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={newAccount.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
            />
          </div>
          {newAccount.role === "club" &&
            !editAccountId && ( // Conditional rendering for facultyAdvisorEmail field
              <div>
                <label className="block mb-2 text-gray-700">
                  Faculty Advisor Email
                </label>
                <input
                  required={newAccount.role === "club"}
                  type="email"
                  name="facultyAdvisorEmail"
                  value={newAccount.facultyAdvisorEmail}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
                />
              </div>
            )}
          <div className="md:col-span-2">
            {editAccountId ? (
              <div className="flex items-center">
                <button
                  disabled={loading}
                  onClick={cancelEdit}
                  className="bg-red-600 text-white rounded-full py-2 px-4 mr-2 focus:outline-none"
                >
                  Cancel Edit
                </button>
                <button
                  disabled={loading}
                  onClick={handleEditAccountCall}
                  className="bg-primary text-white rounded-full py-2 px-4 focus:outline-none hover:bg-primaryLight transition duration-300"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                disabled={loading}
                onClick={handleAddAccount}
                className="w-full bg-primary text-white rounded-full py-2 focus:outline-none hover:bg-primaryLight transition duration-300"
              >
                Add Account
              </button>
            )}
          </div>
        </div>
        <hr className="my-6 border-t border-gray-300" />
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary mb-4"
        />
        <table className="min-w-full">
          <tbody>
            {adminAccounts
              .filter(
                (acc) =>
                  acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  acc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  acc.role.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((account) => (
                <tr key={account._id}>
                  <td className="px-4 py-2">{account.name}</td>
                  <td className="px-4 py-2">{account.email}</td>
                  <td className="px-4 py-2">{account.role}</td>
                  <td className="px-4 py-2 flex justify-center">
                    <button
                      disabled={loading}
                      onClick={() => handleEditAccount(account._id)}
                      className="text-blue-600 mr-2 focus:outline-none"
                    >
                      <RiEdit2Line />
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => handleDeleteAccount(account._id)}
                      className="text-red-600 focus:outline-none"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAccountManagement;
