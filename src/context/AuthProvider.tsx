import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-toastify";

// Define the shape of your Auth context state
interface AuthContextType {
  isAuthenticated: boolean;
  login: (a:any,b:any) => void;
  logout: () => void;
  loading: boolean;
}

// Create context with undefined initial value, forcing usage inside a provider
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider props type
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token"); // Example token check
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: any, password: any) => {
    //call your login API here
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          username: username,
          password: password,
        }
      );
      if (res.data.result) {
        localStorage.setItem("token", res.data.result);
        toast.success("Logged in successfully");
        setIsAuthenticated(true);
      }
      if(res.status === 401 || res.status === 400){
        toast.error("Invalid username or password");
      }
      console.log(res);
    } catch (error:any) {
      console.log(error);
      toast.error(error.response.data.message);
      return; 
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
