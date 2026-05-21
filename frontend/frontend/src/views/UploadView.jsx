
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AnatomicalMapWidget } from '../components/ui/AnatomicalMapWidget';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { 
  Upload, 
  X, 
  ImageIcon, 
  Target, 
  Scan, 
  ArrowLeft,
  Zap,
  Stethoscope,
  Camera,
  RefreshCw,
  Check,
  Loader2,
  AlertCircle,
  FileText,
  ShieldAlert,
  ChevronRight,
  Info,
  Maximize2,
  HeartPulse,
  Activity,
  BrainCircuit,
  Shield,
  Plus
} from 'lucide-react';

const MAX_BATCH_SIZE = 10;

export function UploadView({ setActiveView, authToken, onScanComplete }) {
  // --- Core State ---
  const [intakeQueue, setIntakeQueue] = useState([]); // Array of { id, file, url, preview, location, status, result }
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [bodyLocation, setBodyLocation] = useState('Neutral / Unknown');
  const [selectedQueueId, setSelectedQueueId] = useState(null);
  
  // --- Camera State ---
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('environment'); 
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = React.useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (error) {
      console.error("Camera access error:", error);
    }
  }, [cameraFacing]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const toggleCamera = () => {
    setCameraFacing(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Optimized Camera Lifecycle
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  /**
   * Queue Management
   */
  const addToQueue = (file, url, preview) => {
    if (intakeQueue.length >= MAX_BATCH_SIZE) {
      alert(`Max batch size of ${MAX_BATCH_SIZE} reached.`);
      return;
    }
    const newItem = {
      id: Date.now() + Math.random(),
      file,
      url,
      preview,
      location: bodyLocation,
      status: 'pending',
      result: null
    };
    setIntakeQueue(prev => [...prev, newItem]);
    setSelectedQueueId(newItem.id);
    stopCamera();
  };

  const removeFromQueue = (id) => {
    setIntakeQueue(prev => prev.filter(item => item.id !== id));
    if (selectedQueueId === id) setSelectedQueueId(null);
  };

  const [onlineUrl, setOnlineUrl] = useState('');
  const handleUrlImport = async () => {
    if (!onlineUrl) return;
    addToQueue(null, onlineUrl, onlineUrl);
    setOnlineUrl('');
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      addToQueue(file, null, URL.createObjectURL(file));
    }, 'image/jpeg');
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const availableSpace = MAX_BATCH_SIZE - intakeQueue.length;
    files.slice(0, availableSpace).forEach(file => {
      addToQueue(file, null, URL.createObjectURL(file));
    });
    event.target.value = null; // Clear input
  };

  /**
   * Single Specimen Analysis Core
   */
  const performAnalysis = async (item, force = false) => {
    const formData = new FormData();
    const options = {
      method: 'POST',
      headers: {}
    };

    if (authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    if (item.url) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify({ 
        image_url: item.url, 
        location: item.location,
        force
      });
    } else {
      formData.append('image', item.file);
      formData.append('location', item.location);
      if (force) formData.append('force', 'true');
      options.body = formData;
    }

    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiBaseUrl}/api/analyze`, options);
    
    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Analysis Link Failure" }));
        throw new Error(err.error || "Analysis Link Failure");
    }
    return await response.json();
  };

  /**
   * Manual Force Override
   */
  const forceAnalyzeItem = async (id) => {
    const itemIndex = intakeQueue.findIndex(i => i.id === id);
    if (itemIndex === -1) return;

    const updatedQueue = [...intakeQueue];
    updatedQueue[itemIndex].status = 'analyzing';
    updatedQueue[itemIndex].result = null;
    setIntakeQueue([...updatedQueue]);

    try {
        const data = await performAnalysis(updatedQueue[itemIndex], true);
        updatedQueue[itemIndex].result = data;
        updatedQueue[itemIndex].status = 'completed';
        setSelectedQueueId(id);
    } catch (e) {
        updatedQueue[itemIndex].status = 'failed';
        updatedQueue[itemIndex].error = e.message;
    }
    setIntakeQueue([...updatedQueue]);
  };

  /**
   * Sequential Analysis
   */
  const executeAnalysis = async (id = null) => {
    if (isProcessingBatch) return;
    
    const targetQueue = id ? intakeQueue.filter(i => i.id === id) : intakeQueue;
    if (targetQueue.length === 0) return;

    setIsProcessingBatch(true);
    const updatedQueue = [...intakeQueue];
    
    for (let itemToProcess of targetQueue) {
      if (itemToProcess.status === 'completed') continue;
      
      const idx = updatedQueue.findIndex(i => i.id === itemToProcess.id);
      updatedQueue[idx].status = 'analyzing';
      setIntakeQueue([...updatedQueue]);

      try {
        const data = await performAnalysis(updatedQueue[idx]);
        updatedQueue[idx].result = data;
        updatedQueue[idx].status = 'completed';
        setSelectedQueueId(updatedQueue[idx].id);
      } catch (error) {
        updatedQueue[idx].status = 'failed';
        updatedQueue[idx].error = error.message;
      }
      setIntakeQueue([...updatedQueue]);
    }

    setIsProcessingBatch(false);
    if (onScanComplete) onScanComplete();
  };

  const currentSelectedItem = intakeQueue.find(i => i.id === selectedQueueId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="view-container reveal-entry">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 mb-2 pt-1 border-b border-slate-50 pb-2">
        <div>
          <button 
            onClick={() => { stopCamera(); setActiveView('dashboard'); }} 
            className="flex items-center gap-2 text-violet-600 hover:text-violet-700 font-bold mb-2 transition-all text-xs uppercase tracking-widest group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> 
            Exit Hub
          </button>
          <h1 className="text-display">
            Diagnostic <span className="text-violet-600">Intake Grid</span>
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-violet-50 border border-violet-100 rounded-full w-fit mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[11px] font-bold text-violet-700 uppercase tracking-widest leading-none">Diagnostic Link Active</span>
          </div>
        </div>
        <div className="flex items-center gap-3 px-3 py-1 rounded-lg bg-violet-50/50 border border-violet-100">
           <Zap className="w-3 h-3 text-violet-500" />
          <span className="text-[11px] font-black text-violet-700 uppercase tracking-widest">
            {intakeQueue.length} {intakeQueue.length === 1 ? 'Specimen' : 'Specimens'} Staged
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 relative">
        {/* Left: Imaging Selection */}
        <div className="lg:col-span-4 space-y-3">
          <Card className="p-4 premium-card border-slate-100 bg-white shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-3 opacity-5">
                <Upload className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-600">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider leading-none">Pathology Engine</h3>
                <p className="text-[11px] font-bold text-violet-600 uppercase tracking-widest mt-1">Neural Analysis v5.2</p>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              
              {/* Left Sidebar Import Area connected to label */}
              <label 
                htmlFor="sidebar-file-upload" 
                className="h-24 border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:border-violet-300 hover:bg-violet-50/30 transition-all cursor-pointer group block"
              >
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-violet-600 transition-all border border-slate-50">
                    <Upload className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Clinical Import</p>
                
                <input 
                  type="file" 
                  id="sidebar-file-upload" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                  multiple 
                />
              </label>
 
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Paste Medical Image URL..."
                  className="w-full h-10 bg-slate-50 border border-slate-100 rounded-lg px-3 text-[11px] font-bold text-slate-900 focus:outline-none focus:border-violet-500 transition-all pr-10"
                  value={onlineUrl}
                  onChange={e => setOnlineUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleUrlImport()}
                />
                <button onClick={handleUrlImport} className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-600">
                  <Scan className="w-3.5 h-3.5" />
                </button>
              </div>
 
              <Button onClick={() => isCameraActive ? stopCamera() : startCamera()} className="w-full h-10 !rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 text-[11px] font-black uppercase tracking-widest gap-2 border border-violet-100 transition-all">
                <Camera className="w-4 h-4" />
                {isCameraActive ? "Deactivate Camera" : "Live Capture feed"}
              </Button>
 
              {isCameraActive && (
                <div className="rounded-xl bg-slate-900 overflow-hidden relative aspect-video mt-3 border-2 border-violet-500/20">
                  <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${cameraFacing === 'user' ? 'scale-x-[-1]' : ''}`} />
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                    <button onClick={toggleCamera} className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-violet-500"><RefreshCw className="w-3 h-3"/></button>
                    <button onClick={capturePhoto} className="w-8 h-8 rounded-full bg-white text-violet-600 flex items-center justify-center hover:scale-110 transition-all shadow-xl"><Camera className="w-4 h-4"/></button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4 premium-card border-slate-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
                <Target className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Site localization</h3>
            </div>
            <AnatomicalMapWidget onSelect={setBodyLocation} current={bodyLocation} />
            <div className="mt-3 p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Analysis Zone</p>
              <p className="text-[11px] font-black text-slate-900 uppercase">{bodyLocation}</p>
            </div>
          </Card>
        </div>

        {/* Right: Analysis & Queue */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {intakeQueue.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Card className="p-10 premium-card border-slate-100 bg-white shadow-lg flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                        
                        {/* Big Central Capture Box connected to hidden label input */}
                        <label 
                          htmlFor="center-file-upload"
                          className="flex flex-col items-center justify-center p-8 bg-violet-50/50 border-2 border-dashed border-violet-100 rounded-2xl cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all block"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600 mb-4">
                            <Upload className="w-7 h-7" />
                          </div>
                          <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Capture Clinical Specimen</p>
                          <p className="text-[11px] mt-2 text-slate-500 font-bold uppercase tracking-widest">HEIF, JPEG, or RAW supported</p>
                          
                          <input 
                            type="file" 
                            id="center-file-upload" 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept="image/*" 
                            multiple 
                          />
                        </label>

                    </Card>
                </motion.div>
            ) : intakeQueue.length === 1 ? (
                <motion.div key="single" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <Card className="p-6 md:p-8 premium-card border-violet-100 bg-white shadow-2xl relative overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-48 h-48 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shadow-inner flex-shrink-0 group relative">
                                <img src={intakeQueue[0].preview} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                {intakeQueue[0].status === 'analyzing' && (
                                    <div className="absolute inset-0 bg-violet-600/30 backdrop-blur-[2px] flex items-center justify-center text-white">
                                        <Loader2 className="w-10 h-10 animate-spin" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge className="bg-violet-50 text-violet-600 border-none px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em]">Single Specimen Mode</Badge>
                                        <button onClick={() => removeFromQueue(intakeQueue[0].id)} className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all"><X className="w-3.5 h-3.5"/></button>
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter mb-1">Clinic <span className="text-violet-600">Assessment</span></h2>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{intakeQueue[0].location}</p>
                                </div>
                                <div className="mt-4">
                                    {!intakeQueue[0].result ? (
                                        <Button 
                                            onClick={() => executeAnalysis(intakeQueue[0].id)}
                                            disabled={intakeQueue[0].status === 'analyzing'}
                                            className="w-full h-12 !rounded-xl bg-slate-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
                                        >
                                            {intakeQueue[0].status === 'analyzing' ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> clinical sync...</>
                                            ) : (
                                                <><Scan className="w-5 h-5" /> Initialize mapping</>
                                            )}
                                        </Button>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                             <div className={`flex-1 p-3 rounded-xl border ${intakeQueue[0].result.is_malignant ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
                                                <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${intakeQueue[0].result.is_malignant ? 'text-rose-700' : 'text-violet-700'}`}>
                                                   {intakeQueue[0].result.status_label || (intakeQueue[0].result.is_malignant ? "High Priority" : "Common Condition")}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                     <span className="text-lg font-black text-slate-950 uppercase tracking-tight">{intakeQueue[0].result.prediction}</span>
                                                     <span className={`text-lg font-black ${intakeQueue[0].result.is_malignant ? 'text-rose-600' : 'text-violet-600'}`}>{intakeQueue[0].result.confidence}%</span>
                                                </div>
                                             </div>
                                             <Button onClick={() => setIntakeQueue([])} className="h-12 px-4 !rounded-xl bg-slate-50 text-slate-400 hover:text-violet-600 border border-slate-100 hover:border-violet-100 transition-all"><RefreshCw className="w-4 h-4"/></Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ) : (
                <motion.div key="batch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
                    <Card className="p-4 premium-card border-slate-100 bg-white shadow-xl flex flex-col">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white shadow-lg">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider leading-none">Diagnostic Stream</h3>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">High-Throughput Batch Processing</p>
                                </div>
                            </div>
                            <Button 
                                onClick={() => executeAnalysis()} 
                                disabled={isProcessingBatch} 
                                className="h-10 px-6 !rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-black tracking-widest uppercase shadow-xl group"
                            >
                                {isProcessingBatch ? <><Loader2 className="w-3 h-3 animate-spin mr-2"/> sync...</> : <><Scan className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform"/> Run batch</>}
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 overflow-y-auto max-h-[220px] p-1 scrollbar-hide">
                            {intakeQueue.map(item => (
                                <div 
                                    key={item.id} 
                                    onClick={() => setSelectedQueueId(item.id)}
                                    className="cursor-pointer"
                                >
                                    <Card className={`p-1.5 border-transparent transition-all relative overflow-hidden ${selectedQueueId === item.id ? 'ring-2 ring-violet-500 bg-violet-50/20' : 'bg-slate-50/50 hover:bg-slate-100/50'}`}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 overflow-hidden shadow-sm flex-shrink-0 relative">
                                                <img src={item.preview} className="w-full h-full object-cover" />
                                                {item.status === 'analyzing' && <div className="absolute inset-0 bg-violet-600/20 flex items-center justify-center"><Loader2 className="w-3 h-3 text-white animate-spin"/></div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{item.location}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); removeFromQueue(item.id); }} disabled={isProcessingBatch} className="text-slate-300 hover:text-rose-500"><X className="w-2.5 h-2.5"/></button>
                                                </div>
                                                {item.result ? (
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-[10px] font-black uppercase truncate ${item.result.is_malignant ? 'text-rose-600' : 'text-violet-600'}`}>
                                                            {item.result.prediction.split(' ')[0]}...
                                                        </span>
                                                        <span className={`text-[10px] font-bold ${item.result.is_malignant ? 'text-rose-600' : 'text-violet-600'}`}>{item.result.confidence}%</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{item.status === 'pending' ? "Wait" : "Scan"}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <AnimatePresence>
                        {currentSelectedItem && currentSelectedItem.result && (
                            <motion.div key={`report-${currentSelectedItem.id}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}>
                                <Card className={`p-6 md:p-8 premium-card border-x-4 border-b-4 border-t border-white bg-white shadow-2xl relative overflow-hidden ${currentSelectedItem.result.is_malignant ? 'border-rose-500' : 'border-violet-500'}`}>
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none transition-transform group-hover:scale-110">
                                        <Stethoscope className="w-48 h-48 text-slate-900" />
                                    </div>

                                    <header className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 relative z-10">
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shadow-inner">
                                                <img src={currentSelectedItem.preview} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] ${currentSelectedItem.result.is_malignant ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-violet-600 border-slate-100'}`}>
                                                        {currentSelectedItem.result.status_label || "Pathology sync Verified"}
                                                    </Badge>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Diagnostic Ref: {currentSelectedItem.id.toString().slice(-6)}</span>
                                                </div>
                                                <h2 className="text-2xl font-extrabold text-slate-950 tracking-tighter uppercase leading-none">
                                                    Professional <span className="text-violet-600">Assessment</span>
                                                </h2>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Accuracy index</p>
                                            <div className={`text-4xl font-black tracking-tighter tabular-nums flex items-end gap-1 ${currentSelectedItem.result.is_malignant ? 'text-rose-600' : 'text-slate-950'}`}>
                                                {currentSelectedItem.result.confidence}<span className="text-xl text-violet-600 mb-1">%</span>
                                            </div>
                                        </div>
                                    </header>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Assessment Focus</p>
                                                <h4 className="text-base font-black text-slate-900 uppercase tracking-wide leading-tight">
                                                    {currentSelectedItem.result.prediction}
                                                    <span className="block text-sm font-bold text-violet-600 normal-case tracking-normal mt-0.5">Primary Diagnostic Marker</span>
                                                </h4>
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Confidence</span>
                                                    <span className="text-sm font-black text-violet-600">{currentSelectedItem.result.confidence}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-violet-100 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${currentSelectedItem.result.confidence}%` }}
                                                        className="h-full bg-violet-600 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Specimen Detail</p>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide pb-2 border-b border-white hover:border-violet-100 transition-colors">
                                                    <span className="text-slate-500">Log Protocol</span>
                                                    <span className="text-violet-600">DERM-SYNC-{parseFloat(currentSelectedItem.result.confidence).toFixed(0)}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide pb-2 border-b border-white hover:border-violet-100 transition-colors">
                                                    <span className="text-slate-500">Clinical ID</span>
                                                    <span className="text-violet-600">DS-{Math.floor(Math.random() * 9000 + 1000)}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide">
                                                    <span className="text-slate-500">Localization</span>
                                                    <span className="text-violet-600">{currentSelectedItem.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <footer className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-violet-600 text-white rounded-xl flex items-center justify-between shadow-premium min-w-[180px]">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-3.5 h-3.5" />
                                                    <span className="text-[11px] font-black uppercase tracking-widest">Clinician Override</span>
                                                </div>
                                                <Plus className="w-3.5 h-3.5" />
                                            </div>
                                            <Button variant="ghost" onClick={() => removeFromQueue(currentSelectedItem.id)} className="text-slate-400 hover:text-rose-600 text-[11px] font-black uppercase tracking-widest gap-2">
                                                <ArrowLeft className="w-3 h-3" /> Dismiss entry
                                            </Button>
                                        </div>
                                        <Button onClick={() => setActiveView('records')} className="h-12 px-10 bg-slate-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-2xl transition-all active:scale-95">
                                            Synchronize Registry
                                        </Button>
                                    </footer>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* REDESIGNED UNCERTAIN PRESENTATION STATE (REPLACES "INVALID") */}
                    <AnimatePresence>
                        {currentSelectedItem && currentSelectedItem.status === 'completed' && currentSelectedItem.result && !currentSelectedItem.result.is_valid && !currentSelectedItem.result.was_forced && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                                <Card className="p-6 border-2 border-dashed border-slate-200 bg-slate-50/10 flex flex-col items-center text-center gap-4 mt-4 rounded-3xl">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center shadow-lg">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-950 uppercase tracking-tighter mb-1">Uncertain clinical signature</h3>
                                        <p className="text-xs text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                                            The engine detects a subtle manifestation. This often indicates an early-stage presentation or a non-cancerous anomaly requiring manual override.
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => removeFromQueue(currentSelectedItem.id)} className="h-10 px-6 rounded-lg border-slate-200 text-[10px] font-black uppercase tracking-widest">Discard Entry</Button>
                                        <Button 
                                            onClick={() => forceAnalyzeItem(currentSelectedItem.id)}
                                            className="h-10 px-8 rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all"
                                        >
                                            Force Registry Entry
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}