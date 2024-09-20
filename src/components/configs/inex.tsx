import { useEffect, useState, useRef } from "react";
import { fetchConfigurations } from "../../resources/fetchConfigurations";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type ModalType = "new" | "edit" | "archive" | "view" | "";

export default function ConfigurationManagement() {
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [selectedConfiguration, setSelectedConfiguration] = useState<Configuration | null>(null);
  const [modalType, setModalType] = useState<ModalType>("");
  const [configurationName, setConfigurationName] = useState("");
  const [keyConfigurations, setKeyConfigurations] = useState<KeyConfiguration[]>([]);
  const [isViewing, setisViewing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const history = useNavigate();

  useEffect(() => {
    fetchConfigurations().then((configurations) => setConfigurations(configurations));
    return () => setConfigurations([]);
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

  const handleActionClick = (action: ModalType, configuration: Configuration) => {
    setSelectedConfiguration(configuration);
    setModalType(action);
    if (action === "edit") {
      setConfigurationName(configuration.name);
      setKeyConfigurations(configuration.keyConfigurations);
      setisViewing(true);
    }
    if (action === "view") {
      setisViewing(true);
      history(`/configuration/${configuration._id}`);
    }
    if (action === "archive") {
      //call api to archive configuration
      try {
        // archive
        axios
          .put(`${import.meta.env.VITE_API_URL}/configurations/${configuration._id}`, {
            status: "Archive",
          })
          .then(() => {
            fetchConfigurations().then((configurations) => setConfigurations(configurations));
            setModalType("");
            toast.success("Configuration archived successfully!");
          });
      } catch (error) {
        console.error("Failed to archive configuration:", error);
        toast.error("Failed to archive configuration.");
      } finally {
        fetchConfigurations().then((configurations) => setConfigurations(configurations));
      }
    }
  };

  const handleAdd = async () => {
    //call api to add configuration
    console.log("add configuration");
    try {
      // add
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/configs`,
        { name: configurationName, keyConfigurations }
      );
      if (response.status === 201) {
        fetchConfigurations().then((configurations) => setConfigurations(configurations));
        setModalType("");
        setConfigurationName("");
        setKeyConfigurations([]);
        toast.success("Configuration created successfully!");
      }           
    } catch (error) {
      console.error("Failed to add configuration:", error);
      toast.error("Failed to add configuration.");
    } finally {
      setModalType("");
    }
  };

  const handleUpdate = async () => {
    //call api to update configuration
    console.log("update configuration");
    try {
      // update
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/configs/${selectedConfiguration?._id}`,
        { name: configurationName, keyConfigurations }
      );
      if (response.status === 200) {
        fetchConfigurations().then((configurations) => setConfigurations(configurations));
        setModalType("");
        setConfigurationName("");
        setKeyConfigurations([]);
        toast.success("Configuration updated successfully!");
      }           
    } catch (error) {
      console.error("Failed to update configuration:", error);
      toast.error("Failed to update configuration.");
    } finally {
      setModalType("");
    }
  };

  const addKeyConfiguration = () => {
    setKeyConfigurations([...keyConfigurations, { key: "", type: "" }]);
  };

  const updateKeyConfiguration = (index: number, field: string, value: string) => {
    const updatedKeyConfigurations = keyConfigurations.map((config, i) =>
      i === index ? { ...config, [field]: value } : config
    );
    setKeyConfigurations(updatedKeyConfigurations);
  };

  const deleteKeyConfiguration = (index: number) => {
    const updatedKeyConfigurations = keyConfigurations.filter((_, i) => i !== index);
    setKeyConfigurations(updatedKeyConfigurations);
  };

  interface Configuration {
    _id: string;
    name: string;
    keyConfigurations: KeyConfiguration[];
    lastModified?: string;
  }

  interface KeyConfiguration {
    key: string;
    type: string;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <div className="text-gray-500 text-sm mb-2">
              Home / Configuration Management
            </div>
            <h1 className="text-3xl font-bold text-gray-700">
              Configuration Management
            </h1>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
            onClick={() => setModalType("new")}
          >
            + Create Configuration
          </button>
        </header>

        {/* Table */}
        <div className="overflow-x-auto border rounded-lg bg-white shadow min-h-screen">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 text-center">
              <tr>
                <th className="py-3 px-6  text-xs font-medium text-gray-500 uppercase ">
                  Configuration Name
                </th>
                
                <th className="py-3 px-6  text-xs font-medium text-gray-500 uppercase ">
                  Last Modified Date
                </th>
                <th className="py-3 px-6  text-xs font-medium text-gray-500 uppercase ">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {configurations?.map((configuration, index) => (
                <tr className="border-b relative text-center" key={configuration._id}>
                  <td className="py-4 px-3 text-sm font-medium text-gray-900">
                    <p>{configuration.name}</p>
                  </td>
                  
                  <td className="py-4 px-3 text-sm text-gray-500">
                    {configuration.lastModified}
                  </td>
                  <td className="py-4 px-3 text-sm text-gray-500 relative">
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
                            onClick={() => handleActionClick("edit", configuration)}
                          >
                            View
                          </li>
                          <li
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleActionClick("edit", configuration)}
                          >
                            Edit
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
        {modalType === "new" || (modalType === "edit" && selectedConfiguration) ? (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                {modalType === "new" ? "New Configuration" : "Edit Configuration"}
              </h2>
              <input
                type="text"
                name="configurationName"
                disabled={isViewing}
                value={configurationName}
                onChange={(e) => setConfigurationName(e.target.value)}
                placeholder="Configuration Name"
                className="block w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <div className="mb-4">
                <h3 className="text-md font-semibold mb-2">Key Configurations</h3>
                {keyConfigurations.map((config, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      placeholder="Key"
                      disabled={isViewing}
                      value={config.key}
                      onChange={(e) => updateKeyConfiguration(index, "key", e.target.value)}
                      className="block w-1/2 px-4 py-2 mr-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Type"
                      value={config.type}
                      disabled={isViewing}
                      onChange={(e) => updateKeyConfiguration(index, "type", e.target.value)}
                      className="block w-1/2 px-4 py-2 mr-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => deleteKeyConfiguration(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      &#x2715;
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addKeyConfiguration}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  + Add Key Configuration
                </button>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg"
                  onClick={() => setModalType("")}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={modalType === "new" ? handleAdd : handleUpdate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  {modalType === "new" ? "Create" : "Update"}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {modalType === "archive" && selectedConfiguration && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Archive Configuration</h2>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to archive this configuration?
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
      <ToastContainer />
    </div>
  );
}