import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import Button from '../components/ui/Button';
import CampaignList from '../components/campaign/CampaignList';
import { mockCampaigns } from '../lib/mockData';

const CampaignsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'draft' | 'completed' | 'failed'>('all');
  
  const filteredCampaigns = activeFilter === 'all' 
    ? mockCampaigns 
    : mockCampaigns.filter(campaign => campaign.status === activeFilter);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-500 mt-1">Manage your marketing campaigns</p>
        </div>
        
        <Link to="/campaigns/new">
          <Button icon={<Plus size={16} />}>
            New Campaign
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center overflow-x-auto pb-2">
        <div className="mr-2">
          <Filter size={16} className="text-gray-500" />
        </div>
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md mr-2 ${
            activeFilter === 'all' 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('active')}
          className={`px-4 py-2 text-sm font-medium rounded-md mr-2 ${
            activeFilter === 'active' 
              ? 'bg-green-100 text-green-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveFilter('draft')}
          className={`px-4 py-2 text-sm font-medium rounded-md mr-2 ${
            activeFilter === 'draft' 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Draft
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-4 py-2 text-sm font-medium rounded-md mr-2 ${
            activeFilter === 'completed' 
              ? 'bg-yellow-100 text-yellow-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setActiveFilter('failed')}
          className={`px-4 py-2 text-sm font-medium rounded-md mr-2 ${
            activeFilter === 'failed' 
              ? 'bg-red-100 text-red-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Failed
        </button>
      </div>
      
      <CampaignList campaigns={filteredCampaigns} />
    </div>
  );
};

export default CampaignsPage;