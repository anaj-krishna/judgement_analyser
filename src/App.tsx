import { useState, useEffect, useRef } from 'react';

function App() {
  // Analysis results state
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  
  // Chat functionality
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'assistant', timestamp: Date}[]>([
    {
      text: "Hello! I'm your AI communication analysis assistant. How can I help you analyze your communications today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sample analysis results for demo purposes
  const sampleAnalysisData = {
    overallSentiment: {
      positive: 65,
      neutral: 20,
      negative: 15
    },
    emotionalTones: [
      { name: 'Professional', value: 80 },
      { name: 'Formal', value: 65 },
      { name: 'Friendly', value: 45 },
      { name: 'Urgent', value: 20 },
      { name: 'Confrontational', value: 15 }
    ],
    keyIssues: [
      { issue: 'Communication gaps', severity: 'medium', instances: 4 },
      { issue: 'Conflict avoidance', severity: 'high', instances: 7 },
      { issue: 'Unclear expectations', severity: 'medium', instances: 5 },
      { issue: 'Feedback reception', severity: 'low', instances: 2 }
    ],
    recommendations: [
      'Establish clear communication channels for feedback',
      'Schedule regular check-ins to address concerns',
      'Use more specific language when assigning tasks',
      'Consider implementing a structured feedback process'
    ],
    communicationStats: {
      responseTime: '4.2 hours (average)',
      conversationLength: '12 exchanges (average)',
      participationBalance: '60/40 split between parties',
      topicCoherence: 'Medium (3.6/5)'
    }
  };

  // Auto scroll to bottom of chat
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      text: newMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const responses = [
        "I've analyzed those files. The sentiment appears mostly positive, but there are some concerning patterns in the conflict avoidance area.",
        "Looking at your communication data, I notice a trend of delayed responses which might be impacting team dynamics.",
        "Based on my analysis, your communication style is quite professional, but could benefit from more direct feedback mechanisms.",
        "The data suggests your team has good information sharing but might need more structured follow-up processes."
      ];
      
      const aiMessage = {
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'assistant' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type === 'text/plain' || 
      file.type === 'application/pdf' || 
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'text/csv'
    );
    
    if (validFiles.length > 0) {
      setUploadedFiles(prevFiles => [...prevFiles, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(files => files.filter((_, i) => i !== index));
  };

  const analyzeFiles = () => {
    if (uploadedFiles.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setAnalysisResults(sampleAnalysisData);
      setIsAnalyzing(false);
      setActiveTab('results');
      
      // Add a message to chat about completed analysis
      const aiMessage = {
        text: "I've completed the analysis of your files. You can view the detailed results in the Analysis Results tab.",
        sender: 'assistant' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setChatOpen(true);
    }, 2500);
  };

  const resetAnalysis = () => {
    setAnalysisResults(null);
    setUploadedFiles([]);
    setActiveTab('upload');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-indigo-900 to-blue-900 text-white flex flex-col shadow-xl">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🧠</span>
            <h1 className="text-xl font-bold tracking-wider">AI<span className="text-blue-400"> POLICE</span></h1>
          </div>
        </div>
        
        <div className="flex-1 px-4">
          <nav className="space-y-1">
          
            
           
            
            <button className="flex items-center w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-5 transition-all">
              <span className="text-xl mr-3">📚</span>
              <span>Previous Reports</span>
            </button>
            
            
          </nav>
        </div>
        
        <div className="p-4">
          <button 
            onClick={resetAnalysis}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <span className="flex items-center justify-center"><span className="mr-2">+</span> New Analysis</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab === 'upload' ? 'Judgement Analyser' : 'Analysis Results'}
            </h2>
            
            <div className="flex items-center space-x-4">
             
              
              <button 
                onClick={() => setChatOpen(!chatOpen)} 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
              >
                <span className="text-xl">{chatOpen ? '✕' : '💬'}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content area with chat sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main content */}
          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'upload' && (
              <div className="space-y-6">
                {/* Drop zone */}
                <div 
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                    dragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 bg-white'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-5xl mb-4 text-blue-500">📁</span>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Drag & Drop Files Here</h3>
                    <p className="text-gray-500 mb-4">or</p>
                    
                    <label className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all">
                      <span>Browse Files</span>
                      <input 
                        type="file" 
                        multiple 
                        onChange={handleFileInput}
                        accept=".txt,.pdf,.doc,.docx,.csv"
                        className="hidden"
                      />
                    </label>
                    
                    <p className="text-gray-400 text-sm mt-4">Supported formats: TXT, PDF, DOC, DOCX, CSV</p>
                  </div>
                </div>
                
                {/* Uploaded files */}
                {uploadedFiles.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-100">Uploaded Files</h3>
                    
                    <ul className="mb-6 max-h-64 overflow-y-auto">
                      {uploadedFiles.map((file, index) => (
                        <li key={index} className="flex items-center py-3 px-4 hover:bg-gray-50 rounded-lg transition-all">
                          <span className="text-2xl text-blue-500 mr-4">
                            {file.type.includes('pdf') ? '📄' : 
                             file.type.includes('word') ? '📝' : 
                             file.type.includes('csv') ? '📊' : '📃'}
                          </span>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                          
                          <button 
                            onClick={() => removeFile(index)}
                            className="ml-2 text-gray-400 hover:text-red-500 p-1"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                    
                    <button 
                      onClick={analyzeFiles}
                      disabled={isAnalyzing}
                      className={`w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium flex items-center justify-center transition-all ${
                        isAnalyzing 
                        ? 'opacity-80' 
                        : 'hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg'
                      }`}
                    >
                      {isAnalyzing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing...
                        </>
                      ) : 'Analyze Communication'}
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'results' && analysisResults && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sentiment Analysis */}
                  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
                    <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-100">Sentiment Analysis</h3>
                    
                    <div className="space-y-4">
                      <div className="h-8 bg-gray-100 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-400 h-full flex items-center justify-center text-xs font-medium text-white"
                          style={{width: `${analysisResults.overallSentiment.positive}%`}}
                        >
                          {analysisResults.overallSentiment.positive}%
                        </div>
                        <div 
                          className="bg-gradient-to-r from-gray-400 to-gray-300 h-full flex items-center justify-center text-xs font-medium text-white" 
                          style={{width: `${analysisResults.overallSentiment.neutral}%`}}
                        >
                          {analysisResults.overallSentiment.neutral}%
                        </div>
                        <div 
                          className="bg-gradient-to-r from-red-500 to-red-400 h-full flex items-center justify-center text-xs font-medium text-white" 
                          style={{width: `${analysisResults.overallSentiment.negative}%`}}
                        >
                          {analysisResults.overallSentiment.negative}%
                        </div>
                      </div>
                      
                      <div className="flex justify-center space-x-6">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm text-gray-600">Positive</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                          <span className="text-sm text-gray-600">Neutral</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span className="text-sm text-gray-600">Negative</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Emotional Tone Analysis */}
                  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
                    <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-100">Emotional Tone Analysis</h3>
                    
                    <div className="space-y-4">
                      {analysisResults.emotionalTones.map((tone: any, index: number) => (
                        <div key={index} className="flex items-center">
                          <span className="w-24 text-sm text-gray-700">{tone.name}</span>
                          <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden relative">
                            <div 
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-500"
                              style={{width: `${tone.value}%`}}
                            ></div>
                          </div>
                          <span className="ml-3 text-sm text-gray-600">{tone.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Key Issues */}
                  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
                    <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-100">Key Issues Identified</h3>
                    
                    <ul className="space-y-3">
                      {analysisResults.keyIssues.map((issue: any, index: number) => (
                        <li 
                          key={index} 
                          className={`p-3 rounded-lg ${
                            issue.severity === 'high' ? 'bg-red-50 border-l-4 border-red-500' :
                            issue.severity === 'medium' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                            'bg-green-50 border-l-4 border-green-500'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium text-gray-800">{issue.issue}</h4>
                            <span 
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                                issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}
                            >
                              {issue.severity}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span>Instances detected: </span>
                            <span className="font-medium">{issue.instances}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Recommendations */}
                  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
                    <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-100">Recommendations</h3>
                    
                    <ul className="space-y-3">
                      {analysisResults.recommendations.map((recommendation: string, index: number) => (
                        <li key={index} className="flex items-start py-2 border-b border-gray-100 last:border-0">
                          <span className="text-xl text-blue-500 mr-3">💡</span>
                          <p className="text-gray-700 leading-relaxed">{recommendation}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Communication Stats */}
                  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-100">Communication Statistics</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Object.entries(analysisResults.communicationStats).map(([key, value]: [string, any], index: number) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h4>
                          <p className="text-lg font-semibold text-gray-800">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex space-x-4">
                  <button className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center">
                    <span className="text-xl mr-2">📥</span>
                    Download Full Report
                  </button>
                  <button 
                    onClick={resetAnalysis}
                    className="py-3 px-6 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center"
                  >
                    <span className="text-xl mr-2">🔄</span>
                    Start New Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Chat sidebar */}
          {chatOpen && (
            <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-gray-800">AI Assistant Chat</h3>
                <button 
                  onClick={() => setChatOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs p-3 rounded-lg ${
                        message.sender === 'user' 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ➤
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-white border-t border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500">
            This AI provides communication analysis based on text patterns. For professional advice, consult a qualified expert.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;