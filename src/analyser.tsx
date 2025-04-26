import  { useState, useRef, ChangeEvent } from "react";
import { Upload, AlertCircle, FileText } from "lucide-react";

interface AnalysisResponse {
  judgment_summary: string;
  analysis: string;
}

function AppealabilityAnalyzer() {
  const [judgmentText, setJudgmentText] = useState<string>("");
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [extracting, setExtracting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJudgmentText(e.target.value);
  };

  const extractTextFromPdf = (file: File) => {
    setExtracting(true);
    setUploadStatus("Processing file...");

    const reader = new FileReader();

    reader.onload = () => {
      const fileName = file.name;
      const fileSize = Math.round(file.size / 1024); // Size in KB

      const simulatedText =
        `[Content extracted from ${fileName} (${fileSize}KB)]\n\n` +
        `This is simulated text content from your PDF document. In a production environment, ` +
        `you would use a proper PDF parsing library to extract the actual text content.\n\n` +
        `For demonstration purposes, you can replace this text with your actual judgment text.`;

      setJudgmentText(simulatedText);
      setUploadStatus("File processed. Please review or edit the extracted text.");
      setExtracting(false);
    };

    reader.onerror = () => {
      setError("Error reading the file. Please try again.");
      setUploadStatus("");
      setExtracting(false);
    };

    reader.readAsText(file);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    extractTextFromPdf(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!judgmentText.trim()) {
      setError("Please enter a judgment text or upload a PDF.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          judgment_text: judgmentText,
        }),
      });

      if (!res.ok) {
        throw new Error("API response was not ok");
      }

      const data: AnalysisResponse = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      setError("Error occurred while analyzing appealability.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold">⚖️ Judgment Appealability Analyzer</h1>
        <p className="text-blue-100 text-sm">Upload legal documents and analyze appealability</p>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="mb-4 flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label className="block text-gray-700 font-medium mb-2">Judgment Text</label>
                <textarea
                  rows={12}
                  value={judgmentText}
                  onChange={handleTextChange}
                  placeholder="Paste your judgment text here or upload a PDF file..."
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:w-64">
                <label className="block text-gray-700 font-medium mb-2">Upload Document</label>
                <div
                  onClick={triggerFileInput}
                  className={`h-48 md:h-full w-full border-2 border-dashed ${
                    extracting ? "border-blue-400 bg-blue-50" : "border-blue-300"
                  } rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-blue-50 transition-colors`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="application/pdf"
                    className="hidden"
                  />

                  {extracting ? (
                    <div className="loader mb-2"></div>
                  ) : (
                    <Upload size={32} className="text-blue-500 mb-2" />
                  )}

                  <p className="text-center text-gray-700 font-medium">
                    {extracting ? "Processing PDF..." : "Upload PDF"}
                  </p>

                  {!extracting && (
                    <p className="text-xs text-gray-500 text-center mt-1">Click to browse</p>
                  )}

                  {uploadStatus && (
                    <div className="mt-2 text-xs text-center">
                      <p className="text-blue-600">{uploadStatus}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || extracting}
              className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loader"></span> Analyzing...
                </span>
              ) : (
                "Analyze Appealability"
              )}
            </button>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="flex items-center text-red-600">
                  <AlertCircle size={16} className="mr-2" />
                  {error}
                </p>
              </div>
            )}

            {response && (
              <div className="mt-6 space-y-6">
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FileText size={18} className="text-gray-700 mr-2" />
                    <p className="font-semibold text-gray-700">Input Text</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto bg-white p-3 rounded border border-gray-300">
                    <p className="text-gray-800 whitespace-pre-wrap">{judgmentText}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-3">
                    <FileText size={18} className="text-blue-700 mr-2" />
                    <p className="font-semibold text-blue-700">Analysis Results</p>
                  </div>
                  <div className="bg-white p-4 rounded border border-blue-100">
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-800">Summary</h4>
                      <p className="text-gray-700 mt-1">{response.judgment_summary}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Analysis</h4>
                      <p className="text-gray-700 mt-1">{response.analysis}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-3 px-6 text-center text-sm">
        © 2025 Judgment Appealability Analyzer. All rights reserved.
      </footer>

      {/* CSS Spinner */}
      <style>{`
        .loader {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default AppealabilityAnalyzer;
