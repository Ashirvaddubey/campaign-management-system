import { env } from '../config/env';

if (!env.openaiApiKey) {
  throw new Error('Missing VITE_OPENAI_API_KEY environment variable');
}

// Function to generate campaign message using OpenAI
export async function generateCampaignMessage(
  campaignDetails: {
    name: string;
    description?: string;
    targetAudience?: string;
  }
) {
  try {
    console.log('Generating message with OpenAI...', { campaignDetails });
    
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
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating campaign message:', error);
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