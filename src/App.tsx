

import AppealabilityAnalyzer from './analyser';
function App() {
  

  
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
        
       
      </div>
      
      {/* Main content */}
   <AppealabilityAnalyzer/>
    </div>
  );
}

export default App;