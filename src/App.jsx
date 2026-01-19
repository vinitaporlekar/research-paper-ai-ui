import React, { useState, useEffect } from 'react';
import { Upload, FileText, Search, Trash2, Eye, Tag, Users, Calendar, ExternalLink } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000'; // Update this to match your FastAPI server

function App() {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [userId] = useState('default-user');

  // Fetch papers on component mount
  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/papers?user_id=${userId}`);
      const data = await response.json();
      // parse data.papers.authors from string to array if needed
      data.papers.forEach(paper => {
        if (typeof paper.authors === 'string') {
          try {
            paper.authors = JSON.parse(paper.authors);
          } catch {
            paper.authors = [];
          }
        }
      });
      // parse data.papers.tags from string to array if needed
      data.papers.forEach(paper => {
        if (typeof paper.tags === 'string') {
          try {
            paper.tags = JSON.parse(paper.tags);
          } catch {
            paper.tags = [];
          }
        }
      });
      setPapers(data.papers || []);
    } catch (error) {
      console.error('Error fetching papers:', error);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a valid PDF file');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        fetchPapers(); // Refresh the papers list
        alert('Paper uploaded and processed successfully!');
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.detail}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const deletePaper = async (title) => {
    if (!window.confirm('Are you sure you want to delete this paper?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/papers/${encodeURIComponent(title)}?user_id=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPapers();
        if (selectedPaper && selectedPaper.title === title) {
          setSelectedPaper(null);
        }
        alert('Paper deleted successfully');
      } else {
        alert('Failed to delete paper');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete paper');
    }
  };

  const filteredPapers = papers.filter(paper =>
    paper.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
    paper.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Research Paper AI</h1>
          <p className="text-lg text-slate-600">Upload, organize, and explore your research papers with AI-powered insights</p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-slate-300 bg-white hover:border-blue-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Upload Research Paper</h3>
            <p className="text-slate-500 mb-4">Drag and drop your PDF file here, or click to browse</p>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="file-upload"
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                isUploading
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isUploading ? 'Processing...' : 'Choose PDF File'}
            </label>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        {/* Simple Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search papers by title, authors, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white shadow-lg"
                autoComplete="off"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-3 text-center">
                <span className="text-sm text-slate-600">
                  Found {filteredPapers.length} papers matching "{searchTerm}"
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Papers List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Your Papers ({filteredPapers.length})
            </h2>
            
            {filteredPapers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
                <FileText className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                  {papers.length === 0 ? 'No papers uploaded yet' : 'No papers match your search'}
                </h3>
                <p className="text-slate-500">
                  {papers.length === 0 
                    ? 'Upload your first research paper to get started'
                    : 'Try adjusting your search terms'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPapers.map((paper) => (                  
                  <div
                    key={paper.id}
                    className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
                      selectedPaper?.id === paper.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedPaper(paper)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 flex-1">
                        {paper.title}
                      </h3>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPaper(paper);
                          }}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePaper(paper.title);
                          }}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all"
                          title="Delete paper"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="truncate">
                          {Array.isArray(paper.authors) 
                            ? paper.authors.slice(0, 2).join(', ') + (paper.authors.length > 2 ? '...' : '')
                            : 'Unknown'
                          }
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(paper.created_at)}</span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {paper.abstract}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(paper.tags) && paper.tags.slice(0, 4).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Paper Details Panel */}
          <div className="lg:col-span-1">
            {selectedPaper ? (
              <div className="bg-white rounded-xl p-6 shadow-sm border sticky top-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Paper Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Title</h3>
                    <p className="text-slate-600">{selectedPaper.title}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Authors</h3>
                    <div className="space-y-1">
                      {Array.isArray(selectedPaper.authors) ? 
                        selectedPaper.authors.map((author, index) => (
                          <p key={index} className="text-slate-600">{author}</p>
                        )) :
                        <p className="text-slate-600">Unknown</p>
                      }
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Abstract</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {selectedPaper.abstract}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedPaper.tags) ?
                        selectedPaper.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        )) :
                        <p className="text-slate-500">No tags</p>
                      }
                    </div>
                  </div>

                  {selectedPaper.file_url && (
                    <div>
                      <h3 className="font-semibold text-slate-700 mb-2">Source</h3>
                      <a
                        href={selectedPaper.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Original
                      </a>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Paper ID</h3>
                    <p className="text-slate-600 text-sm font-mono">
                      {selectedPaper.paper_id}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Added</h3>
                    <p className="text-slate-600 text-sm">
                      {formatDate(selectedPaper.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">No Paper Selected</h3>
                  <p className="text-slate-500">Click on a paper from the list to view its details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;