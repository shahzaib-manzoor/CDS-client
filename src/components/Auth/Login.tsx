import companyLogo from '../../assets/company.svg';

export default function Login({ onLogin }: { onLogin: () => void }) {
  console.log('Login Component',onLogin);
      // const [email, setEmail] = useState('');
      // const [password, setPassword] = useState('');
    
      // const handleSubmit = (e:any) => {
      //   e.preventDefault();
      //   // Authentication logic (replace with actual login check)
      //   if (email === 'admin' && password === 'password') {
      //     onLogin();
      //   } else {
      //     alert('Invalid credentials');
      //   }
      // };
  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-100">
      <div className="flex   bg-white shadow-lg rounded-lg overflow-hidden h-screen w-screen">
        
        {/* Left Section */}
        <div className="w-1/2 bg-blue-600 p-12 flex flex-col justify-center">
          <div className="text-white text-center">
            <img  alt="Logo" src={companyLogo} className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-3xl font-bold">Clinical Decision Support</h1>
            <p className="mt-4 text-lg">
              Empowering Smarter Decisions for Better Patient Outcomes
            </p>
            <p className="mt-2 text-sm">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. 
              Velit officia consequat duis enim velit mollit exercitation.
            </p>
            <div className="mt-8 text-sm">Powered by <strong>TexMed</strong></div>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
        <div className="w-2/3">
          <h2 className="text-3xl font-bold text-gray-700 mb-6">Welcome</h2>
          <p className="text-gray-500 mb-6">Sign in to CDS</p>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">Username or Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Username or Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                  Keep me logged in
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Forgot Password?
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-gray-500">
            Don't have an account? <a href="#" className="text-blue-600 hover:text-blue-500">Contact Administrator</a>
          </div>
            </div>
        </div>
        
      </div>
    </div>
  );
}
