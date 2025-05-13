import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, BarChart2, Users, MessageSquare, BrainCircuit } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { testConnection } from '../lib/api/test';

const HomePage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const [testResult, setTestResult] = useState<string>('');
  
  const handleTest = async () => {
    try {
      const result = await testConnection();
      setTestResult(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Test failed:', error);
      setTestResult(JSON.stringify(error, null, 2));
    }
  };

  return (
    <div className="space-y-12 py-8">
      {/* Hero section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Intelligent</span>
          <span className="block text-blue-600">Campaign Management</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
          Create targeted campaigns that connect with your audience using our AI-powered platform.
        </p>
        <div className="mx-auto mt-8 flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/campaigns/new">
                <Button size="lg" icon={<ArrowRight size={20} className="ml-2" />}>
                  Create a Campaign
                </Button>
              </Link>
              <Button variant="outline" size="lg" onClick={handleTest}>
                Test Backend Connection
              </Button>
            </>
          ) : (
            <Button size="lg" onClick={login}>
              Get Started
            </Button>
          )}
          <Link to="/campaigns">
            <Button variant="outline" size="lg">
              View Campaigns
            </Button>
          </Link>
        </div>
        {testResult && (
          <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-left overflow-auto max-h-60">
            {testResult}
          </pre>
        )}
      </div>

      {/* Features section */}
      <div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
          Powerful Features to Reach Your Customers
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Audience Segmentation</h3>
              <p className="mt-2 text-sm text-gray-500">
                Create precise audience segments with our intuitive rule builder.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-purple-100">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Personalized Messaging</h3>
              <p className="mt-2 text-sm text-gray-500">
                Create tailored messages for each segment to improve engagement.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
                <BarChart2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Performance Analytics</h3>
              <p className="mt-2 text-sm text-gray-500">
                Track campaign performance with detailed analytics and insights.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-orange-100">
                <BrainCircuit className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">AI-Powered Suggestions</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get smart recommendations for targeting and messaging.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-blue-700 rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Ready to boost your marketing?
            </h2>
            <p className="mt-3 text-lg text-blue-200">
              Start creating personalized campaigns in minutes.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8">
            {isAuthenticated ? (
              <Link to="/campaigns/new">
                <Button variant="outline" size="lg" className="bg-white text-blue-700 border-white hover:bg-blue-50">
                  Create a Campaign
                </Button>
              </Link>
            ) : (
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white text-blue-700 border-white hover:bg-blue-50"
                onClick={login}
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;