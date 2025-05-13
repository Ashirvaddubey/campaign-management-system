import { Campaign, FieldOption } from '../types';

// Mock field options for rule builder
export const fieldOptions: FieldOption[] = [
  {
    id: 'spend',
    label: 'Total Spend',
    type: 'number',
    operators: ['>', '<', '>=', '<=', '=', '!='],
  },
  {
    id: 'inactive',
    label: 'Inactive Days',
    type: 'number',
    operators: ['>', '<', '>=', '<=', '=', '!='],
  },
  {
    id: 'lastPurchase',
    label: 'Last Purchase Date',
    type: 'date',
    operators: ['before', 'after', 'between'],
  },
  {
    id: 'purchaseCount',
    label: 'Purchase Count',
    type: 'number',
    operators: ['>', '<', '>=', '<=', '=', '!='],
  },
  {
    id: 'location',
    label: 'Location',
    type: 'string',
    operators: ['=', '!=', 'contains', 'startsWith'],
  },
  {
    id: 'email',
    label: 'Email',
    type: 'string',
    operators: ['=', '!=', 'contains', 'endsWith'],
  },
  {
    id: 'subscribed',
    label: 'Is Subscribed',
    type: 'boolean',
    operators: ['='],
  },
];

// Mock campaigns data
export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Re-engage High Spenders',
    description: 'Target customers who spent over $10,000 but inactive for 90+ days',
    rules: {
      id: 'g1',
      combinator: 'AND',
      rules: [
        {
          id: 'r1',
          field: 'spend',
          operator: '>',
          value: 10000,
        },
        {
          id: 'r2',
          field: 'inactive',
          operator: '>',
          value: 90,
        },
      ],
    },
    audienceSize: 1243,
    status: 'active',
    message: 'We miss you! Here\'s 20% off your next purchase as a valued customer.',
    createdAt: '2025-03-15T14:22:47Z',
    updatedAt: '2025-03-15T14:22:47Z',
    deliveryStats: {
      sent: 1243,
      delivered: 1198,
      failed: 45,
      opened: 876,
      clicked: 432,
    },
  },
  {
    id: '2',
    name: 'New Product Announcement',
    description: 'Inform customers about our new product line',
    rules: {
      id: 'g2',
      combinator: 'OR',
      rules: [
        {
          id: 'r3',
          field: 'lastPurchase',
          operator: 'after',
          value: '2025-01-01',
        },
        {
          id: 'r4',
          field: 'subscribed',
          operator: '=',
          value: true,
        },
      ],
    },
    audienceSize: 3567,
    status: 'completed',
    message: 'Introducing our revolutionary new product line! Be the first to try it out.',
    createdAt: '2025-02-28T09:15:22Z',
    updatedAt: '2025-03-05T16:40:12Z',
    deliveryStats: {
      sent: 3567,
      delivered: 3489,
      failed: 78,
      opened: 2541,
      clicked: 1233,
    },
  },
  {
    id: '3',
    name: 'Abandoned Cart Recovery',
    description: 'Remind customers about items left in their carts',
    rules: {
      id: 'g3',
      combinator: 'AND',
      rules: [
        {
          id: 'r5',
          field: 'lastPurchase',
          operator: 'before',
          value: '2025-03-01',
        },
        {
          id: 'g4',
          combinator: 'OR',
          rules: [
            {
              id: 'r6',
              field: 'spend',
              operator: '>',
              value: 5000,
            },
            {
              id: 'r7',
              field: 'purchaseCount',
              operator: '>',
              value: 3,
            },
          ],
        },
      ],
    },
    audienceSize: 875,
    status: 'draft',
    message: 'Complete your purchase now and get free shipping!',
    createdAt: '2025-03-10T11:30:45Z',
    updatedAt: '2025-03-10T11:30:45Z',
  },
  {
    id: '4',
    name: 'Loyalty Program Invitation',
    description: 'Invite high-value customers to join our loyalty program',
    rules: {
      id: 'g5',
      combinator: 'AND',
      rules: [
        {
          id: 'r8',
          field: 'spend',
          operator: '>',
          value: 25000,
        },
        {
          id: 'r9',
          field: 'purchaseCount',
          operator: '>',
          value: 10,
        },
      ],
    },
    audienceSize: 328,
    status: 'failed',
    message: 'You\'re invited to our exclusive VIP loyalty program with special perks!',
    createdAt: '2025-02-15T08:45:33Z',
    updatedAt: '2025-02-16T17:22:10Z',
    deliveryStats: {
      sent: 328,
      delivered: 301,
      failed: 27,
      opened: 245,
      clicked: 156,
    },
  },
];

// Mock function to simulate API call for audience size prediction
export const getAudienceSizePrediction = (rules: any): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a random number between 100 and 10000
      const audienceSize = Math.floor(Math.random() * 9900) + 100;
      resolve(audienceSize);
    }, 500);
  });
};

// Mock function to simulate API call for AI suggestions
export const getAiSuggestions = (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple mock responses based on keywords in the prompt
      if (prompt.toLowerCase().includes('inactive')) {
        resolve("We miss you! Come back and enjoy 15% off your next purchase with code WELCOME15.");
      } else if (prompt.toLowerCase().includes('high spend') || prompt.toLowerCase().includes('loyal')) {
        resolve("As one of our most valued customers, we\'d like to offer you exclusive early access to our new collection.");
      } else if (prompt.toLowerCase().includes('new customer') || prompt.toLowerCase().includes('first purchase')) {
        resolve("Thanks for joining us! Enjoy free shipping on your first order with code FIRSTSHIP.");
      } else {
        resolve("Thank you for being our customer! Here\'s a special offer just for you.");
      }
    }, 800);
  });
};