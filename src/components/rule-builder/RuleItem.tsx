import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Rule, FieldOption } from '../../types';
import Select, { SelectOption } from '../ui/Select';
import Input from '../ui/Input';

interface RuleItemProps {
  rule: Rule;
  fieldOptions: FieldOption[];
  onChange: (id: string, updatedRule: Partial<Rule>) => void;
  onDelete: (id: string) => void;
}

const RuleItem: React.FC<RuleItemProps> = ({ 
  rule, 
  fieldOptions, 
  onChange, 
  onDelete 
}) => {
  const [selectedField, setSelectedField] = useState<FieldOption | undefined>(
    fieldOptions.find(field => field.id === rule.field)
  );
  const [operatorOptions, setOperatorOptions] = useState<SelectOption[]>([]);
  
  useEffect(() => {
    if (selectedField) {
      setOperatorOptions(
        selectedField.operators.map(op => ({
          value: op,
          label: getOperatorLabel(op),
        }))
      );
    }
  }, [selectedField]);
  
  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newField = fieldOptions.find(field => field.id === e.target.value);
    setSelectedField(newField);
    
    // Set default operator when field changes
    if (newField && newField.operators.length > 0) {
      onChange(rule.id, { 
        field: newField.id, 
        operator: newField.operators[0],
        // Reset value when field type changes
        value: newField.type === 'boolean' ? true : ''
      });
    }
  };
  
  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(rule.id, { operator: e.target.value });
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    let value: string | number | boolean = target.value;
    
    // Convert value based on field type
    if (selectedField?.type === 'number' && target.value !== '') {
      value = parseFloat(target.value);
    } else if (selectedField?.type === 'boolean') {
      value = target.value === 'true';
    }
    
    onChange(rule.id, { value });
  };

  const getOperatorLabel = (operator: string): string => {
    const operatorLabels: Record<string, string> = {
      '>': 'Greater than',
      '<': 'Less than',
      '>=': 'Greater than or equal',
      '<=': 'Less than or equal',
      '=': 'Equal to',
      '!=': 'Not equal to',
      'contains': 'Contains',
      'startsWith': 'Starts with',
      'endsWith': 'Ends with',
      'before': 'Before',
      'after': 'After',
      'between': 'Between',
    };
    
    return operatorLabels[operator] || operator;
  };
  
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <Select 
        options={fieldOptions.map(field => ({ value: field.id, label: field.label }))} 
        value={rule.field}
        onChange={handleFieldChange}
        className="flex-1 min-w-[150px]"
      />
      
      <Select 
        options={operatorOptions} 
        value={rule.operator}
        onChange={handleOperatorChange}
        className="flex-1 min-w-[150px]"
      />
      
      {selectedField?.type === 'boolean' ? (
        <Select
          options={[
            { value: 'true', label: 'True' },
            { value: 'false', label: 'False' },
          ]}
          value={String(rule.value)}
          onChange={handleValueChange}
          className="flex-1 min-w-[150px]"
        />
      ) : selectedField?.type === 'date' ? (
        <Input
          type="date"
          value={rule.value as string}
          onChange={handleValueChange}
          className="flex-1 min-w-[150px]"
        />
      ) : (
        <Input
          type={selectedField?.type === 'number' ? 'number' : 'text'}
          value={rule.value as string}
          onChange={handleValueChange}
          className="flex-1 min-w-[150px]"
        />
      )}
      
      <button
        onClick={() => onDelete(rule.id)}
        className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Delete rule"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default RuleItem;