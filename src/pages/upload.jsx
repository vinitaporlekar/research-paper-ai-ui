import { useState } from 'react';
import { Upload as UploadIcon, FileText, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', 'demo-user');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setResult(data);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Upload Research Paper
        </h1>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <UploadIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg text-gray-700 mb-4">
              Select a PDF file to upload
            </p>
            <label className="cursor-pointer bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 inline-block transition">
              Choose PDF File
              <input
                type="file"
                className="hidden"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>

          {/* Selected File */}
          {file && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-semibold text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="h-5 w-5" />
                      Upload & Process
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Success Result */}
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h2 className="text-2xl font-bold text-green-700">
                Upload Successful!
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {result.paper.title}
                </h3>
              </div>

              {result.paper.authors && result.paper.authors.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Authors:</p>
                  <p className="text-gray-800">{result.paper.authors.join(', ')}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Abstract:</p>
                <p className="text-gray-800">{result.paper.abstract}</p>
              </div>

              {result.paper.tags && result.paper.tags.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.paper.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.paper.key_findings && result.paper.key_findings.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Key Findings:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-800">
                    {result.paper.key_findings.map((finding, index) => (
                      <li key={index}>{finding}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">Upload Failed</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}