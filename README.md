# Campaign Management System

A modern campaign management system built with React, TypeScript, and Supabase. This application helps users create, manage, and analyze marketing campaigns with AI-powered message generation.

🚀 **Live Demo:** [https://project-hmj8xg2is-ashirvaddubeys-projects.vercel.app](https://project-hmj8xg2is-ashirvaddubeys-projects.vercel.app)

## Features

- 🔐 User Authentication with Google OAuth
- 📊 Campaign Analytics Dashboard
- 👥 Audience Segmentation
- 🤖 AI-Powered Message Generation
- 📱 Responsive Design
- 🎯 Campaign Targeting Rules

## Tech Stack

- Frontend:
  - React 18
  - TypeScript
  - Vite
  - TailwindCSS
  - Lucide Icons

- Backend:
  - Supabase (Database & Authentication)
  - OpenAI API (Message Generation)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/campaign-management-system.git
   cd campaign-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── lib/           # Utility functions and API clients
├── pages/         # Application pages/routes
├── types/         # TypeScript type definitions
└── config/        # Configuration files
```

## Deployment

The application is deployed on Vercel at [https://project-hmj8xg2is-ashirvaddubeys-projects.vercel.app](https://project-hmj8xg2is-ashirvaddubeys-projects.vercel.app). Any push to the main branch will trigger an automatic deployment.

## Environment Variables

Make sure to set up the following environment variables in your deployment platform:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_OPENAI_API_KEY`: Your OpenAI API key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 