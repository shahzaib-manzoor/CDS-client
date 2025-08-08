import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import companyLogo from '../../assets/company.svg';
import { useAuth } from '../../context/AuthProvider';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(email, password);
    // Redirect to protected route if login is successful
    navigate('/pathways');
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-100">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden h-screen w-screen">
        
        {/* Left Section */}
        <div className="w-1/2 bg-blue-600 p-12 flex flex-col justify-center">
          <div className="text-white text-center">
            <img alt="Logo" src={companyLogo} className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-3xl font-bold">Clinical Decision Support</h1>
            <p className="mt-4 text-lg">
              Empowering Smarter Decisions for Better Patient Outcomes
            </p>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <div className="w-2/3">
            <h2 className="text-3xl font-bold text-gray-700 mb-6">Welcome</h2>
            <p className="text-gray-500 mb-6">Sign in to Cure Natural</p>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              <div>
                <label htmlFor="email" className="sr-only">Username or Email</label>
                <input
                  id="email"
                  name="username"
                  type="text"
                  required
                  placeholder="Username or Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
}
