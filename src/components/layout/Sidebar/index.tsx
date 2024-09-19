import { Link } from "react-router-dom";
import { FaChartBar, FaCogs, FaList } from "react-icons/fa"; // Import icons from react-icons
import { useAuth } from "../../../context/AuthProvider";
 

const SideBar = () => {
  const {logout} = useAuth();

  return (
    <div className="h-screen bg-gray-100 p-5 fixed top-0 left-0 border-r border-gray-300 transition-all duration-300 ease-in-out w-64 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-4 hidden md:block">Sidebar</h2>
        <ul className="list-none p-0">
          <li className="flex items-center py-2">
            <FaChartBar className="text-gray-800 mx-2" />
            <Link to="/analytics" className="block py-2 px-4 text-gray-800 hover:bg-gray-200">
              Analytics
            </Link>
          </li>
          <li className="flex items-center py-2">
            <FaCogs className="text-gray-800 mx-2" />
            <Link to="/pathways" className="block py-2 px-4 text-gray-800 hover:bg-gray-200">
              Pathways
            </Link>
          </li>
          <li className="flex items-center py-2">
            <FaList className="text-gray-800 mx-2" />
            <Link to="/criteria" className="block py-2 px-4 text-gray-800 hover:bg-gray-200">
              Criteria
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex items-center py-2">
        <button type="button" onClick={()=>{logout()}} className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg w-full">
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;