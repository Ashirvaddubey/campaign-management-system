import { env } from '../config/env';

if (!env.openaiApiKey) {
  throw new Error('Missing VITE_OPENAI_API_KEY environment variable');
}

// Fallback messages for when API is unavailable
const fallbackMessages = {
  general: "Thank you for choosing our service! We're excited to help you achieve your goals.",
  promotional: "Limited time offer! Don't miss out on this exclusive opportunity.",
  engagement: "Join our community and discover amazing possibilities!",
  educational: "Learn, grow, and succeed with our comprehensive solutions.",
};

// Function to get a fallback message
function getFallbackMessage(type: string = 'general'): string {
  return fallbackMessages[type as keyof typeof fallbackMessages] || fallbackMessages.general;
}

// Rate limiting variables
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

// Function to generate campaign message using OpenAI
export async function generateCampaignMessage(
  campaignDetails: {
    name: string;
    description?: string;
    targetAudience?: string;
  }
) {
  try {
    // Check rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
    }
    lastRequestTime = Date.now();

    console.log('Generating message with OpenAI...', { 
      name: campaignDetails.name,
      description: campaignDetails.description,
      targetAudience: campaignDetails.targetAudience 
    });
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a marketing expert that helps create engaging campaign messages.'
          },
          {
            role: 'user',
            content: `Create a compelling marketing message for a campaign with the following details:
              Name: ${campaignDetails.name}
              Description: ${campaignDetails.description || 'N/A'}
              Target Audience: ${campaignDetails.targetAudience || 'General audience'}
              
              The message should be concise, engaging, and tailored to the target audience.
              Keep the message under 200 words.`
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('OpenAI API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      // Handle rate limiting with fallback
      if (response.status === 429) {
        console.log('Rate limit hit, using fallback message');
        return getFallbackMessage(
          campaignDetails.description?.toLowerCase().includes('promotion') ? 'promotional' : 'general'
        );
      }
      
      // More specific error messages based on status codes
      if (response.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your API key and try again.');
      } else if (response.status === 500) {
        throw new Error('OpenAI service is currently experiencing issues. Please try again later.');
      }
      
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response:', data);
      throw new Error('Invalid response from OpenAI');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating campaign message:', error);
    // Use fallback message for any errors
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      return getFallbackMessage(
        campaignDetails.description?.toLowerCase().includes('promotion') ? 'promotional' : 'general'
      );
    }
    if (error instanceof Error) {
      throw new Error(`Failed to generate message: ${error.message}`);
    }
    throw new Error('Failed to generate message: Unknown error');
  }
}

// Function to test OpenAI connection
export async function testOpenAIConnection() {
  try {
    const testMessage = await generateCampaignMessage({
      name: 'Test Campaign',
      description: 'Testing OpenAI connection',
    });
    console.log('OpenAI connection test successful!');
    return true;
  } catch (error) {
    console.error('OpenAI connection test failed:', error);
    return false;
  }
} 