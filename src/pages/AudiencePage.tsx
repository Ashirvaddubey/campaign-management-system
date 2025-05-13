import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Users, Filter, Plus, Trash2, Edit2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { getSegments, createSegment, deleteSegment } from '../lib/api/segments';
import { AudienceSegment, RuleGroup } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const AudiencePage: React.FC = () => {
  const { user } = useAuth();
  const [segments, setSegments] = useState<AudienceSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newSegment, setNewSegment] = useState({
    name: '',
    description: '',
    user_id: user?.id || '',
    rules: {
      id: uuidv4(),
      combinator: 'AND',
      rules: []
    } as RuleGroup
  });

  useEffect(() => {
    if (user?.id) {
      setNewSegment(prev => ({ ...prev, user_id: user.id }));
      fetchSegments();
    }
  }, [user]);

  const fetchSegments = async () => {
    try {
      setIsLoading(true);
      const data = await getSegments();
      setSegments(data);
    } catch (err) {
      setError('Failed to load audience segments');
      console.error('Error fetching segments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSegment = async () => {
    try {
      if (!newSegment.name.trim()) {
        setError('Segment name is required');
        return;
      }

      if (!user?.id) {
        setError('You must be logged in to create segments');
        return;
      }

      const segment = await createSegment(newSegment);
      setSegments(prev => [...prev, segment]);
      setIsCreating(false);
      setNewSegment({
        name: '',
        description: '',
        user_id: user.id,
        rules: {
          id: uuidv4(),
          combinator: 'AND',
          rules: []
        } as RuleGroup
      });
    } catch (err) {
      setError('Failed to create segment');
      console.error('Error creating segment:', err);
    }
  };

  const handleDeleteSegment = async (id: string) => {
    try {
      await deleteSegment(id);
      setSegments(prev => prev.filter(segment => segment.id !== id));
    } catch (err) {
      setError('Failed to delete segment');
      console.error('Error deleting segment:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Authentication Required</h3>
        <p className="mt-1 text-sm text-gray-500">Please log in to manage audience segments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Audience Segments</h1>
        <Button
          onClick={() => setIsCreating(true)}
          icon={<Plus size={16} />}
        >
          Create Segment
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {isCreating && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Create New Segment</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Segment Name"
              value={newSegment.name}
              onChange={(e) => setNewSegment(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., High-Value Customers"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newSegment.description}
                onChange={(e) => setNewSegment(prev => ({ ...prev, description: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={3}
                placeholder="Describe this audience segment"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSegment}
            >
              Create Segment
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segments.map((segment) => (
          <Card key={segment.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{segment.name}</h3>
                    <p className="text-sm text-gray-500">{segment.description || 'No description'}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => {/* Handle edit */}}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => handleDeleteSegment(segment.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Filter size={14} className="mr-1" />
                  {segment.rules.rules.length} rules
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Created {new Date(segment.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {segments.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No segments</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new audience segment.</p>
          <div className="mt-6">
            <Button
              onClick={() => setIsCreating(true)}
              icon={<Plus size={16} />}
            >
              Create Segment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudiencePage; 