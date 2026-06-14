// Importing required Libraries
import { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function App() {
  
  // Defining the inputs
  const [params, setParams] = useState({
    L_mmr: 8.0,
    L_stub1: 3.5,
    L_stub2: 2.0,
    W_mmr: 3.8,
    min_freq: 2.0,
    max_freq: 12.0
  });
  
  // Graphing State
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Line Visibility State
  const [visibleLines, setVisibleLines] = useState({
    S11: true,
    S21: true,
    S12: true,
    S22: true
  });

  // Standard Input Handlers
  const handleInputChange = (e) => {
    setParams({ ...params, [e.target.name]: parseFloat(e.target.value) });
  };

  // Slider Logic to prevent Min and Max from crossing
  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    let val = parseFloat(value);

    if (name === 'min_freq') {
      if (val >= params.max_freq) val = params.max_freq - 0.5;
    } else if (name === 'max_freq') {
      if (val <= params.min_freq) val = params.min_freq + 0.5;
    }

    setParams({ ...params, [name]: val });
  };

  // Line Toggle Handlers
  const toggleLine = (line) => {
    setVisibleLines(prev => ({ ...prev, [line]: !prev[line] }));
  };

  // Prediction Model
  const runSimulation = async () => {
    setLoading(true);
    try {
      // Connecting frontend to the backend
      const response = await axios.post('http://127.0.0.1:8000/predict', params);
      setGraphData(response.data.data);
    } catch (error) {
      console.error("Simulation failed:", error);
      alert("Cannot connect to ML Engine. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    // Main UI Background
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* App Title */}
        <h1 className="text-3xl font-bold mb-8 text-blue-400">MIMO RF Filter AI Designer</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR: Control Panel */}
          <div className="bg-gray-800 p-6 rounded-xl w-full lg:w-1/3 shadow-2xl border border-gray-700 h-fit">
            <h2 className="text-xl font-semibold mb-6 text-white border-b border-gray-700 pb-2">Physical Parameters</h2>
            
            {/* Input Fields */}
            <div className="space-y-4">
              {['L_mmr', 'L_stub1', 'L_stub2', 'W_mmr'].map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-400 mb-1">{key} (mm)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    name={key} 
                    value={params[key]} 
                    onChange={handleInputChange} 
                    className="w-full bg-gray-900 p-3 rounded-lg text-white border border-gray-600 focus:border-blue-500 outline-none transition-colors" 
                  />
                </div>
              ))}
            </div>

            {/* Sweep Settings Toggle */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 focus:outline-none"
              >
                {showAdvanced ? "▼ Hide Sweep Settings" : "▶ Show Advanced Sweep Settings"}
              </button>
              
              {/* Frequency Sliders */}
              {showAdvanced && (
                <div className="mt-4 space-y-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-gray-400">Min Frequency</label>
                      <span className="text-sm text-blue-400 font-bold">{params.min_freq.toFixed(1)} GHz</span>
                    </div>
                    <input 
                      type="range" 
                      name="min_freq" 
                      min="2.0" 
                      max="12.0" 
                      step="0.1" 
                      value={params.min_freq} 
                      onChange={handleSliderChange} 
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-gray-400">Max Frequency</label>
                      <span className="text-sm text-blue-400 font-bold">{params.max_freq.toFixed(1)} GHz</span>
                    </div>
                    <input 
                      type="range" 
                      name="max_freq" 
                      min="2.0" 
                      max="12.0" 
                      step="0.1" 
                      value={params.max_freq} 
                      onChange={handleSliderChange} 
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                    />
                  </div>

                </div>
              )}
            </div>

            {/* Submit Button */}
            <button 
              onClick={runSimulation}
              disabled={loading}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-blue-500/30"
            >
              {loading ? "Running ML Engine..." : "Run Real-Time Simulation"}
            </button>
          </div>

          {/* RIGHT MAIN AREA: Graph Output */}
          <div className="bg-gray-800 p-6 rounded-xl w-full lg:w-2/3 shadow-2xl border border-gray-700 min-h-[500px] flex flex-col">
            
            {/* Graph Header and Toggles */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-700 pb-2">
              <h2 className="text-xl font-semibold text-white">MIMO S-Parameters</h2>
              
              <div className="flex flex-wrap gap-2">
                <button onClick={() => toggleLine('S11')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${visibleLines.S11 ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-gray-900 text-gray-600 border border-gray-700'}`}>S11 (Red)</button>
                <button onClick={() => toggleLine('S21')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${visibleLines.S21 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-gray-900 text-gray-600 border border-gray-700'}`}>S21 (Blue)</button>
                <button onClick={() => toggleLine('S12')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${visibleLines.S12 ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-gray-900 text-gray-600 border border-gray-700'}`}>S12 (Green)</button>
                <button onClick={() => toggleLine('S22')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${visibleLines.S22 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : 'bg-gray-900 text-gray-600 border border-gray-700'}`}>S22 (Yellow)</button>
              </div>
            </div>
            
            {/* Graphing Library Display */}
            {graphData.length === 0 ? (
              <div className="flex-grow flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-700 rounded-lg min-h-[400px]">
                <p>Click "Run Real-Time Simulation" to generate S-parameters.</p>
              </div>
            ) : (
              <div className="w-full mt-4 flex-grow">
                <div className="w-full overflow-x-auto flex justify-center bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <LineChart width={700} height={400} data={graphData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="freq" stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} type="number" domain={[params.min_freq, params.max_freq]} />
                    <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} domain={[-50, 10]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }} itemStyle={{ color: '#F3F4F6' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                    
                    {visibleLines.S11 && <Line type="monotone" dataKey="S11" stroke="#EF4444" strokeWidth={3} dot={false} isAnimationActive={false} name="S11 (dB)" />}
                    {visibleLines.S21 && <Line type="monotone" dataKey="S21" stroke="#3B82F6" strokeWidth={3} dot={false} isAnimationActive={false} name="S21 (dB)" />}
                    {visibleLines.S12 && <Line type="monotone" dataKey="S12" stroke="#10B981" strokeWidth={3} strokeDasharray="7 7" dot={false} isAnimationActive={false} name="S12 (dB)" />}
                    {visibleLines.S22 && <Line type="monotone" dataKey="S22" stroke="#F59E0B" strokeWidth={3} strokeDasharray="7 7" dot={false} isAnimationActive={false} name="S22 (dB)" />}
                  </LineChart>
                </div>

                {/* Status Monitor */}
                <div className="mt-6 p-3 bg-gray-950 border border-gray-700 rounded-lg text-sm text-green-400 font-mono">
                  <p className="text-gray-500 mb-1">Active Sweep Windows (F_min to F_max):</p>
                  <span>{params.min_freq.toFixed(1)} GHz to {params.max_freq.toFixed(1)} GHz ({graphData.length} active sample frames)</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}