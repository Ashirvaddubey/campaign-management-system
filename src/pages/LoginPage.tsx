import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { ToggleLeft as Google, BarChart2 } from 'lucide-react';

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
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-blue-100">
          <BarChart2 className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to CampaignHQ
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Manage your campaigns and reach your audience effectively
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-4">
          <Button
            onClick={handleLogin}
            icon={<Google size={18} />}
            fullWidth
            className="py-2.5"
          >
            Sign in with Google
          </Button>
          
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div>
            <Button 
              variant="outline" 
              onClick={() => {}} 
              fullWidth
              className="py-2.5"
            >
              Continue as Demo User
            </Button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          By signing in, you agree to our{' '}
          <a href="#" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;