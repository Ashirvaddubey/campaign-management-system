import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { ToggleLeft as Google, BarChart2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const LoginPage: React.FC = () => {
  const { isAuthenticated, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  
  const handleLogin = async () => {
    await login();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Campaign Management System</h1>
          <p className="text-gray-600">Streamline your marketing campaigns with AI</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Key Features:</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• AI-Powered Content Generation</li>
              <li>• Real-time Analytics Dashboard</li>
              <li>• Smart Audience Segmentation</li>
              <li>• Secure Data Management</li>
            </ul>
          </div>

          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-800 text-white rounded-lg py-3 px-4 transition-colors"
          >
            <FaGithub className="text-xl" />
            <span>Continue with GitHub</span>
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;