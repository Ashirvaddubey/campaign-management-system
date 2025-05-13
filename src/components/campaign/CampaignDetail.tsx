import React from 'react';
import { Campaign } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Edit, BarChart2, Clock, Calendar, Mail, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CampaignDetailProps {
  campaign: Campaign;
}

const CampaignDetail: React.FC<CampaignDetailProps> = ({ campaign }) => {
  const navigate = useNavigate();
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
          <p className="text-gray-500 mt-1">{campaign.description}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant={getStatusVariant(campaign.status)}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
          
          <Button
            variant="outline"
            icon={<Edit size={16} />}
            onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
          >
            Edit
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Campaign Overview</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Users className="text-blue-600 mr-2" size={18} />
                  <span className="text-sm font-medium text-gray-500">Audience Size</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{campaign.audienceSize.toLocaleString()}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="text-blue-600 mr-2" size={18} />
                  <span className="text-sm font-medium text-gray-500">Created</span>
                </div>
                <p className="text-base font-medium text-gray-900">{formatDate(campaign.createdAt)}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                <div className="flex items-center mb-2">
                  <Mail className="text-blue-600 mr-2" size={18} />
                  <span className="text-sm font-medium text-gray-500">Campaign Message</span>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-line">{campaign.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {campaign.deliveryStats ? (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Delivery Statistics</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Mail className="text-blue-600 mr-2" size={18} />
                    <span className="text-sm font-medium text-gray-500">Sent</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{campaign.deliveryStats.sent.toLocaleString()}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="text-green-600 mr-2" size={18} />
                    <span className="text-sm font-medium text-gray-500">Delivered</span>
                  </div>
                  <div className="flex items-end space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {campaign.deliveryStats.delivered.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      ({Math.round((campaign.deliveryStats.delivered / campaign.deliveryStats.sent) * 100)}%)
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="text-red-600 mr-2" size={18} />
                    <span className="text-sm font-medium text-gray-500">Failed</span>
                  </div>
                  <div className="flex items-end space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {campaign.deliveryStats.failed.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      ({Math.round((campaign.deliveryStats.failed / campaign.deliveryStats.sent) * 100)}%)
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BarChart2 className="text-purple-600 mr-2" size={18} />
                    <span className="text-sm font-medium text-gray-500">Opened</span>
                  </div>
                  <div className="flex items-end space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {campaign.deliveryStats.opened.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      ({Math.round((campaign.deliveryStats.opened / campaign.deliveryStats.delivered) * 100)}%)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.round((campaign.deliveryStats.opened / campaign.deliveryStats.sent) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Delivery Statistics</h2>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-base font-medium text-gray-900">No delivery data yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Statistics will appear here once the campaign is active.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CampaignDetail;