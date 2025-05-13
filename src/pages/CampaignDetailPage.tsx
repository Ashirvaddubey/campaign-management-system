import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import CampaignDetail from '../components/campaign/CampaignDetail';
import { mockCampaigns } from '../lib/mockData';
import { Campaign } from '../types';

const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const loadCampaign = () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API delay
        setTimeout(() => {
          const foundCampaign = mockCampaigns.find(c => c.id === id);
          
          if (foundCampaign) {
            setCampaign(foundCampaign);
          } else {
            setError('Campaign not found');
          }
          
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load campaign');
        setIsLoading(false);
      }
    };
    
    loadCampaign();
  }, [id]);
  
  const handleBack = () => {
    navigate('/campaigns');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
        <h2 className="text-lg font-medium text-red-800 mb-2">{error}</h2>
        <p className="text-red-700 mb-4">The campaign you're looking for could not be found.</p>
        <Button variant="outline" onClick={handleBack}>
          Back to Campaigns
        </Button>
      </div>
    );
  }
  
  if (!campaign) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft size={16} />}
          onClick={handleBack}
        >
          Back to Campaigns
        </Button>
      </div>
      
      <CampaignDetail campaign={campaign} />
    </div>
  );
};

export default CampaignDetailPage;