import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import { getUserId } from '../utils/userSession';

export default function ChatPage({ paperId, onBack }) {
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaper();
  }, [paperId]);

  const loadPaper = async () => {
    try {
      const userId = getUserId();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/papers/${paperId}?user_id=${userId}`,
        {
          headers: {
            'X-API-Key': import.meta.env.VITE_API_KEY,
          },
        }
      );
      const data = await response.json();
      setPaper(data);
    } catch (error) {
      console.error('Error loading paper:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Paper not found</p>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to papers
        </button>

        {/* Paper info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {paper.title}
          </h1>
          {paper.authors && paper.authors.length > 0 && (
            <p className="text-gray-600 mb-4">
              {paper.authors.join(', ')}
            </p>
          )}
          <p className="text-gray-700 text-sm">{paper.abstract}</p>
        </div>

        {/* Chat interface */}
        <ChatInterface paperId={paperId} paperTitle={paper.title} />
      </div>
    </div>
  );
}