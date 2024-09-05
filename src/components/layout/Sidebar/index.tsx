// src/components/Sidebar.js

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-100 p-5 fixed top-0 left-0 border-r border-gray-300">
      <h2 className="text-xl font-semibold mb-4">Sidebar</h2>
      <ul className="list-none p-0">
        <li className="mb-2"> 
          <a href="#rule1" className="text-gray-800 hover:underline">Rule Management</a>
        </li>
         
      </ul> 
    </div>
  );
};

export default Sidebar;
