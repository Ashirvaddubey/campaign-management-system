import React, { useState } from 'react';
import { Campaign } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import { BarChart2, Calendar, Search, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CampaignListProps {
  campaigns: Campaign[];
}

const CampaignList: React.FC<CampaignListProps> = ({ campaigns }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status' | 'audience'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const getStatusVariant = (status: Campaign['status']) => {
    const statusMap: Record<Campaign['status'], 'primary' | 'success' | 'warning' | 'danger'> = {
      draft: 'primary',
      active: 'success',
      completed: 'warning',
      failed: 'danger',
    };
    return statusMap[status];
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleSort = (field: 'date' | 'name' | 'status' | 'audience') => {
    if (sortBy === field) {
      // Toggle direction if clicking on the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to descending
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  const handleCampaignClick = (campaign: Campaign) => {
    navigate(`/campaigns/${campaign.id}`);
  };
  
  // Filter campaigns by search term
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort campaigns
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortBy) {
      case 'date':
        return direction * (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'name':
        return direction * a.name.localeCompare(b.name);
      case 'status':
        return direction * a.status.localeCompare(b.status);
      case 'audience':
        return direction * (a.audienceSize - b.audienceSize);
      default:
        return 0;
    }
  });
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Campaign History</h2>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Campaign</span>
                      {sortBy === 'name' && (
                        <ChevronDown 
                          size={16} 
                          className={`transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} 
                        />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('audience')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Audience Size</span>
                      {sortBy === 'audience' && (
                        <ChevronDown 
                          size={16} 
                          className={`transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} 
                        />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortBy === 'status' && (
                        <ChevronDown 
                          size={16} 
                          className={`transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} 
                        />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Created</span>
                      {sortBy === 'date' && (
                        <ChevronDown 
                          size={16} 
                          className={`transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} 
                        />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCampaigns.length > 0 ? (
                  sortedCampaigns.map((campaign) => (
                    <tr 
                      key={campaign.id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleCampaignClick(campaign)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{campaign.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <BarChart2 size={16} className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{campaign.audienceSize.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusVariant(campaign.status)}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={16} className="mr-2" />
                          {formatDate(campaign.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                      {searchTerm ? 'No campaigns match your search' : 'No campaigns created yet'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignList;