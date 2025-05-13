import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import CampaignForm from '../components/campaign/CampaignForm';
import { Campaign } from '../types';
import { useAuth } from '../contexts/AuthContext';

const NewCampaignPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  
  const handleBack = () => {
    navigate('/campaigns');
  };
  
  const handleSave = (campaign: Campaign) => {
    // In a real app, this would be an API call to save the campaign
    console.log('Saving campaign:', campaign);
    
    // Navigate to the campaigns list
    navigate('/campaigns');
  };
  
  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          You need to be logged in to create a new campaign.
        </p>
        <Button onClick={login}>Sign in</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft size={16} />}
            onClick={handleBack}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 ml-4">Create New Campaign</h1>
        </div>
      </div>
      
      <CampaignForm onSave={handleSave} />
    </div>
  );
};

export default NewCampaignPage;