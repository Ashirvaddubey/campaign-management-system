import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { RuleGroup as RuleGroupType, Rule, FieldOption } from '../../types';
import RuleItem from './RuleItem';
import Button from '../ui/Button';
import { v4 as uuidv4 } from 'uuid';

interface RuleGroupProps {
  group: RuleGroupType;
  fieldOptions: FieldOption[];
  onChange: (id: string, updatedGroup: Partial<RuleGroupType>) => void;
  onDelete?: (id: string) => void;
  level?: number;
}

const RuleGroup: React.FC<RuleGroupProps> = ({
  group,
  fieldOptions,
  onChange,
  onDelete,
  level = 0,
}) => {
  const handleCombinatorChange = (combinator: 'AND' | 'OR') => {
    onChange(group.id, { combinator });
  };

  const handleAddRule = () => {
    const newRule: Rule = {
      id: uuidv4(),
      field: fieldOptions[0].id,
      operator: fieldOptions[0].operators[0],
      value: fieldOptions[0].type === 'boolean' ? true : '',
    };
    
    onChange(group.id, {
      rules: [...group.rules, newRule],
    });
  };

  const handleAddGroup = () => {
    const newGroup: RuleGroupType = {
      id: uuidv4(),
      combinator: 'AND',
      rules: [],
    };
    
    onChange(group.id, {
      rules: [...group.rules, newGroup],
    });
  };

  const handleRuleChange = (id: string, updatedRule: Partial<Rule>) => {
    const updatedRules = group.rules.map(rule => {
      if ('combinator' in rule) {
        // This is a group
        return rule;
      }
      
      // This is a rule
      return rule.id === id ? { ...rule, ...updatedRule } : rule;
    });
    
    onChange(group.id, { rules: updatedRules });
  };

  const handleGroupChange = (id: string, updatedGroup: Partial<RuleGroupType>) => {
    const updatedRules = group.rules.map(rule => {
      if ('combinator' in rule && rule.id === id) {
        // This is the group we want to update
        return { ...rule, ...updatedGroup };
      }
      
      // Return unchanged
      return rule;
    });
    
    onChange(group.id, { rules: updatedRules });
  };

  const handleDeleteRule = (id: string) => {
    onChange(group.id, {
      rules: group.rules.filter(rule => {
        if ('combinator' in rule) {
          // This is a group
          return rule.id !== id;
        }
        
        // This is a rule
        return rule.id !== id;
      }),
    });
  };

  const bgColors = [
    'bg-white',
    'bg-gray-50',
    'bg-white',
  ];

  const borderColors = [
    'border-gray-200',
    'border-gray-300',
    'border-gray-200',
  ];

  return (
    <div 
      className={`p-4 rounded-lg border ${borderColors[level % 3]} ${bgColors[level % 3]} transition-all duration-200`}
    >
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">If all of the following conditions are true:</span>
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1 text-sm rounded-l-md transition-colors ${
                group.combinator === 'AND'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => handleCombinatorChange('AND')}
            >
              AND
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-r-md transition-colors ${
                group.combinator === 'OR'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => handleCombinatorChange('OR')}
            >
              OR
            </button>
          </div>
        </div>
        
        {onDelete && (
          <button
            onClick={() => onDelete(group.id)}
            className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Delete group"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {group.rules.map(rule => {
          if ('combinator' in rule) {
            // Render a nested rule group
            return (
              <RuleGroup
                key={rule.id}
                group={rule}
                fieldOptions={fieldOptions}
                onChange={handleGroupChange}
                onDelete={handleDeleteRule}
                level={level + 1}
              />
            );
          } else {
            // Render a rule item
            return (
              <RuleItem
                key={rule.id}
                rule={rule}
                fieldOptions={fieldOptions}
                onChange={handleRuleChange}
                onDelete={handleDeleteRule}
              />
            );
          }
        })}
        
        {group.rules.length === 0 && (
          <div className="py-6 text-center text-gray-500 italic">
            No conditions added yet. Add a condition below.
          </div>
        )}
      </div>
      
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          icon={<Plus size={16} />}
          onClick={handleAddRule}
        >
          Add Condition
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          icon={<Plus size={16} />}
          onClick={handleAddGroup}
        >
          Add Group
        </Button>
      </div>
    </div>
  );
};

export default RuleGroup;