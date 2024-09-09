// src/components/Sidebar.js

import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-100 p-5 fixed top-0 left-0 border-r border-gray-300">
      <h2 className="text-xl font-semibold mb-4">Sidebar</h2>
      <ul className="list-none p-0">
         <Link to="/rules" className="block py-2 px-4 text-gray-800 hover:bg-gray-200">Analytics</Link>
         
      </ul> 
      <ul className="list-none p-0">
         <Link to="/rules" className="block py-2 px-4 text-gray-800 hover:bg-gray-200">Rule Engine</Link>
         
      </ul> 
      <ul className="list-none p-0">
         <Link to="/rules" className="block py-2 px-4 text-gray-800 hover:bg-gray-200">Conditions</Link>
         
      </ul> 
    </div>
  );
};

export default Sidebar;
