import React, { useState, useEffect } from 'react';
import { RuleGroup as RuleGroupType, FieldOption } from '../../types';
import RuleGroup from './RuleGroup';
import { v4 as uuidv4 } from 'uuid';
import { Users } from 'lucide-react';
import { getAudienceSizePrediction } from '../../lib/mockData';

interface RuleBuilderProps {
  fieldOptions: FieldOption[];
  initialRules?: RuleGroupType;
  onChange: (rules: RuleGroupType) => void;
}

const RuleBuilder: React.FC<RuleBuilderProps> = ({
  fieldOptions,
  initialRules,
  onChange,
}) => {
  const [rules, setRules] = useState<RuleGroupType>(
    initialRules || {
      id: uuidv4(),
      combinator: 'AND',
      rules: [],
    }
  );
  
  const [audienceSize, setAudienceSize] = useState<number | null>(null);
  const [isLoadingSize, setIsLoadingSize] = useState(false);
  
  useEffect(() => {
    // Call parent onChange handler when rules change
    onChange(rules);
    
    // Update audience size prediction
    const updateAudienceSize = async () => {
      if (rules.rules.length > 0) {
        setIsLoadingSize(true);
        try {
          const size = await getAudienceSizePrediction(rules);
          setAudienceSize(size);
        } catch (error) {
          console.error('Failed to get audience size:', error);
          setAudienceSize(null);
        } finally {
          setIsLoadingSize(false);
        }
      } else {
        setAudienceSize(null);
      }
    };
    
    updateAudienceSize();
  }, [rules, onChange]);
  
  const handleRootGroupChange = (id: string, updatedGroup: Partial<RuleGroupType>) => {
    if (id === rules.id) {
      setRules(prev => ({ ...prev, ...updatedGroup }));
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">Audience Segmentation</h3>
          <p className="text-sm text-gray-500">Define the conditions that will determine your target audience.</p>
        </div>
        
        <RuleGroup
          group={rules}
          fieldOptions={fieldOptions}
          onChange={handleRootGroupChange}
        />
        
        <div className="mt-6 flex items-center">
          <div className="p-2 bg-blue-100 rounded-full mr-3">
            <Users className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Estimated audience size</p>
            {isLoadingSize ? (
              <div className="h-6 flex items-center">
                <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
              </div>
            ) : audienceSize ? (
              <p className="text-2xl font-bold text-blue-700">{audienceSize.toLocaleString()}</p>
            ) : (
              <p className="text-sm text-gray-500">Add conditions to see estimated audience size</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleBuilder;