import { useEffect, useState, useRef } from "react";
import { fetchRules } from "../../resources/fetchRules";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

type ModalType = "new" | "edit" | "archive" | "view" | "";

export default function RuleManagement() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [modalType, setModalType] = useState<ModalType>("");
  const [ruleName, setRuleName] = useState("");
  const [isEditing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const history = useNavigate();

  useEffect(() => {
    fetchRules("Active").then((rules) => setRules(rules));
    return () => setRules([]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleActionClick = (action: ModalType, rule: Rule) => {
    setSelectedRule(rule);
    setModalType(action);
    if (action === "edit" || action === "view") {
      history(`/mindmap/${rule._id}`);
    }
    if (action === "archive") {
      //call api to archive rule
      try {
        // archive
        axios
          .put(`${import.meta.env.VITE_API_URL}/rules/${rule._id}`, {
            status: "Archive",
          })
          .then(() => {
            fetchRules("Active").then((rules) => setRules(rules));
            setModalType("");
          });
      } catch (error) {
        console.error("Failed to archive rule:", error);
      } finally {
        fetchRules("Active").then((rules) => setRules(rules));
      }
    }
  };

  const handleAdd = async () => {
    //call api to add rule
    console.log("add rule");
    try {
      // add
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/rules`,
        { name: ruleName }
      );
      if (response.status === 200) {
        fetchRules("Active").then((rules) => setRules(rules));
        setModalType("");
        setRuleName("");
      }
    } catch (error) {
      console.error("Failed to add rule:", error);
    }
  };

  interface Rule {
    _id: string;
    name: string;
    objective?: string;
    status?: "Active" | "Inactive";
    lastModified?: string;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <div className="text-gray-500 text-sm mb-2">
              Home / Pathways Management
            </div>
            <h1 className="text-3xl font-bold text-gray-700">
              Pathways Management
            </h1>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
            onClick={() => setModalType("new")}
          >
            + Create Pathway
          </button>
        </header>

        {/* Table */}
        <div className="overflow-x-auto border rounded-lg bg-white shadow min-h-screen">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Name
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Objective
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified Date
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rules?.map((rule, index) => (
                <tr className="border-b relative" key={rule._id}>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    <Link to={`/mindmap/${rule._id}`}>{rule.name}</Link>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {rule.objective}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        rule.status === "Active"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {rule.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {rule.lastModified}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500 relative">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setShowDropdown((prev) =>
                          prev === index ? null : index
                        )
                      }
                    >
                      &#8230;
                    </button>
                    {showDropdown === index && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-10"
                      >
                        <ul>
                          <li
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleActionClick("view", rule)}
                          >
                            View
                          </li>
                          <li
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleActionClick("edit", rule)}
                          >
                            Edit
                          </li>
                          <li
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleActionClick("archive", rule)}
                          >
                            Archive
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        {modalType === "new" && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">New Rule</h2>
              <input
                type="text"
                name="ruleName"
                value={isEditing ? selectedRule?.name : ruleName}
                onChange={(e) => {
                  isEditing ? "" : setRuleName(e.target.value);
                }}
                placeholder="Rule Name"
                className="block w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg"
                  onClick={() => setModalType("")}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {modalType === "archive" && selectedRule && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Archive Rule</h2>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to archive this rule?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg"
                  onClick={() => setModalType("")}
                >
                  Cancel
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
