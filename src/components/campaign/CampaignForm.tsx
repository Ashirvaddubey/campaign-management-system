import React, { useState } from 'react';
import { RuleGroup, Campaign } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { fieldOptions } from '../../lib/mockData';
import RuleBuilder from '../rule-builder/RuleBuilder';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Sparkles, Send } from 'lucide-react';
import { generateCampaignMessage } from '../../lib/openai';
import { createCampaign } from '../../lib/api/campaigns';
import { useAuth } from '../../contexts/AuthContext';

interface CampaignFormProps {
  initialCampaign?: Campaign;
  onSave: (campaign: Campaign) => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ 
  initialCampaign,
  onSave
}) => {
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<Omit<Campaign, 'id' | 'created_at' | 'updated_at'>>({
    user_id: user?.id || '',
    name: '',
    description: '',
    rules: {
      id: uuidv4(),
      combinator: 'AND',
      rules: [],
    },
    message: '',
    status: 'draft',
    audience_size: 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setCampaign(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleRulesChange = (rules: RuleGroup) => {
    setCampaign(prev => ({
      ...prev,
      rules
    }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!campaign.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }
    
    if (!campaign.message.trim()) {
      newErrors.message = 'Campaign message is required';
    }
    
    if (campaign.rules.rules.length === 0) {
      newErrors.rules = 'At least one rule is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleGenerateMessage = async () => {
    if (!campaign.name) {
      setErrors(prev => ({
        ...prev,
        name: 'Please enter a campaign name first'
      }));
      return;
    }

    try {
      setIsGeneratingMessage(true);
      setErrors({});
      
      console.log('Generating message for campaign:', {
        name: campaign.name,
        description: campaign.description,
        rules: campaign.rules
      });
      
      const message = await generateCampaignMessage({
        name: campaign.name,
        description: campaign.description,
        targetAudience: campaign.rules.rules.length > 0 
          ? `Audience defined by rules: ${JSON.stringify(campaign.rules)}`
          : 'General audience'
      });
      
      if (!message) {
        throw new Error('No message was generated');
      }
      
      setCampaign(prev => ({
        ...prev,
        message
      }));
    } catch (error) {
      console.error('Failed to generate message:', error);
      setErrors(prev => ({
        ...prev,
        message: error instanceof Error 
          ? error.message 
          : 'Failed to generate message. Please check your OpenAI API key and try again.'
      }));
    } finally {
      setIsGeneratingMessage(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!user?.id) {
      setErrors(prev => ({
        ...prev,
        form: 'You must be logged in to create a campaign'
      }));
      return;
    }
    
    setIsSaving(true);
    try {
      const campaignData = {
        ...campaign,
        user_id: user.id,
        status: 'draft' as const
      };
      
      const newCampaign = await createCampaign(campaignData);
      if (!newCampaign) {
        throw new Error('Failed to create campaign');
      }
      
      onSave(newCampaign);
    } catch (error) {
      console.error('Failed to save campaign:', error);
      setErrors(prev => ({
        ...prev,
        form: error instanceof Error ? error.message : 'Failed to save campaign. Please try again.',
      }));
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader className="border-b">
          <h2 className="text-xl font-semibold text-gray-900">Campaign Details</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Campaign Name"
            name="name"
            value={campaign.name}
            onChange={handleInputChange}
            placeholder="e.g., Summer Sale Promotion"
            error={errors.name}
            fullWidth
            required
          />
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={campaign.description}
              onChange={handleInputChange}
              placeholder="Briefly describe the purpose of this campaign"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </CardContent>
      </Card>
      
      {errors.rules && (
        <div className="text-sm text-red-600 mt-1">{errors.rules}</div>
      )}
      
      <RuleBuilder 
        fieldOptions={fieldOptions}
        initialRules={campaign.rules}
        onChange={handleRulesChange}
      />
      
      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Campaign Message</h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<Sparkles size={16} />}
              onClick={handleGenerateMessage}
              isLoading={isGeneratingMessage}
            >
              Generate with AI
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={campaign.message}
              onChange={handleInputChange}
              placeholder="Enter your campaign message or generate one with AI"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
            {errors.message && (
              <div className="text-sm text-red-600 mt-1">{errors.message}</div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button 
            type="submit" 
            icon={<Send size={16} />}
            isLoading={isSaving}
          >
            Create Campaign
          </Button>
        </CardFooter>
      </Card>
      
      {errors.form && (
        <div className="text-sm text-red-600 mt-4 p-3 bg-red-50 rounded-md border border-red-200">
          {errors.form}
        </div>
      )}
    </form>
  );
};

export default CampaignForm;