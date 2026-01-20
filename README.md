# Research Paper AI - Frontend

Clean and intuitive React interface for AI-powered research paper management.

## Demo

https://github.com/user-attachments/assets/836dfa08-6050-4eb0-a002-585e64584885

## AI
- Used Gemini-2.5-flash LLM 🧠
- Prompt instruction to output structured json output compliant with Supabase PosgreSQL table schema

## Backend Repo Ref
https://github.com/vinitaporlekar/research-paper-ai-api/ 

## Features

- 📤 Drag & drop PDF upload
- 🎨 Beautiful UI with Tailwind CSS
- 📚 Paper library with search and filters
- 🏷️ Tag-based filtering
- 📊 Paper cards with metadata
- 🗑️ Delete functionality
- 📱 Responsive design

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **FastAPI Backend** - API integration

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/research-paper-ai-ui.git
cd research-paper-ai-ui
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:
```bash
VITE_API_URL=http://localhost:8080
VITE_API_KEY=your-secret-api-key
```

**Note:** The API key must match the one in your backend `.env` file.

### 4. Run the development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`
