import React, { useState, useEffect, useCallback } from 'react';
import { removeBackground } from '@imgly/background-removal';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './utils/canvasUtils';
import { generatePassportPDF } from './utils/pdfGenerator';
import { 
  Upload, Download, Crop, Trash2, Printer, 
  Loader2, RefreshCw, Layers, Moon, Sun, Camera, 
  Contact,
  Contact2
} from 'lucide-react';


const SIZES = {
  US: { name: "USA (2x2 in)", width: 51, height: 51, aspect: 1 },
  UK: { name: "UK/EU/India (35x45 mm)", width: 35, height: 45, aspect: 0.77 },
  CN: { name: "China (33x48 mm)", width: 33, height: 48, aspect: 0.68 }
};

const SHEET_SIZES = {
  A4: { name: "A4 Sheet", width: 210, height: 297 },
  "4x6": { name: "4x6 Photo", width: 101.6, height: 152.4 },
  "5x7": { name: "5x7 Photo", width: 127, height: 177.8 }
};

export default function App() {
  // --- CORE STATE ---
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixelCrop, setPixelCrop] = useState(null);
  
  // --- PREFERENCES ---
  const [selectedSize, setSelectedSize] = useState('UK');
  const [selectedSheet, setSelectedSheet] = useState('A4');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [photoCount, setPhotoCount] = useState(6);

  // --- PERSISTENT THEME LOGIC ---
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('passport-theme');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('passport-theme', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // --- IMAGE HANDLERS ---
  const handleImageData = (data) => {
    setImage(data);
    setCroppedImage(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => handleImageData(reader.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const processImage = async () => {
    setIsProcessing(true);
    try {
      const croppedBase64 = await getCroppedImg(image, pixelCrop);
      const blob = await removeBackground(croppedBase64);
      if (croppedImage) URL.revokeObjectURL(croppedImage);
      setCroppedImage(URL.createObjectURL(blob));
    } catch (e) {
      alert("AI Processing failed. Ensure your photo has a clear subject.");
    }
    setIsProcessing(false);
  };

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = croppedImage;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      generatePassportPDF(canvas.toDataURL('image/jpeg'), photoCount, selectedSheet, SIZES[selectedSize]);
    };
  };

  return (
    <div className={`min-h-screen transition-all duration-700 font-sans ${
      darkMode ? 'bg-[#020617] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      
      {/* PREMIUM BACKGROUND GLOWS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-40 transition-colors duration-1000 ${
          darkMode ? 'bg-blue-900/30' : 'bg-blue-200'
        }`} />
        <div className={`absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-30 transition-colors duration-1000 ${
          darkMode ? 'bg-indigo-900/20' : 'bg-indigo-200'
        }`} />
      </div>

      <input type="file" onChange={onSelectFile} className="hidden" id="fileInput" accept="image/*" />

      {/* REFINED HEADER */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all ${
        darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/60 border-slate-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg flex items-center justify-center rotate-3">
              <Printer size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight dark:text-white">Maya Studio</h1>
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest leading-none mt-1">K.K Communication</p>
            </div>
          </div>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all active:scale-95 ${
              darkMode ? 'bg-slate-900 border-slate-700 text-yellow-400' : 'bg-white border-slate-200 text-indigo-600 shadow-sm'
            }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </header>

      {/* NEW HERO SCROLL SECTION */}
<section className={`relative overflow-hidden border-b py-6 select-none transition-colors ${
  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-blue-50'
}`}>
  {/* Fade edges for a premium look */}
  <div className="absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-inherit to-transparent" />
  <div className="absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-inherit to-transparent" />

  <div className="animate-marquee-infinite">
    {/* We repeat the text 4 times to ensure no gaps on large screens */}
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center">
        <span className="text-5xl md:text-7xl font-black px-6 tracking-tighter uppercase text-blue-600">
          K.K COMMUNICATION
        </span>
        <span className="text-5xl md:text-7xl font-black px-6 tracking-tighter uppercase outline-text">
          K.K COMMUNICATION
        </span>
        <span className="text-5xl md:text-7xl font-black px-6 tracking-tighter uppercase text-blue-600">
          —
        </span>
      </div>
    ))}
  </div>
</section>

      <main className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 p-8 lg:p-12">
        
        {/* LEFT: EDITOR SECTION */}
        <div className={`lg:col-span-7 rounded-[40px] border shadow-2xl transition-all overflow-hidden ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white/80 border-white shadow-blue-900/5'
        }`}>
          {!image ? (
            <div className="h-[600px] flex flex-col items-center justify-center p-12 text-center">
              <div className="relative w-32 h-32 mb-10 group">
                <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full group-hover:bg-blue-400/40 transition-all" />
                <div className="relative w-full h-full bg-white dark:bg-slate-800 rounded-[35%] shadow-xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
                  <Upload className="text-blue-600" size={40} />
                </div>
              </div>
              <h2 className="text-3xl font-black mb-4 tracking-tight">Ready for your ID?</h2>
              <p className="text-slate-400 mb-10 max-w-xs text-sm font-medium">Upload a portrait to start. We'll handle the sizing and background removal.</p>
              <label htmlFor="fileInput" className="px-10 py-5 bg-slate-900 dark:bg-blue-600 rounded-[24px] font-black text-white cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl">
                Get Started
              </label>
            </div>
          ) : (
            <div className="p-4 lg:p-8">
              <div className="relative h-[480px] w-full bg-slate-100 dark:bg-slate-800 rounded-[32px] overflow-hidden group shadow-inner border border-slate-200 dark:border-slate-700">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={SIZES[selectedSize].aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, pixels) => setPixelCrop(pixels)}
                />
                <div className="absolute top-6 right-6 flex gap-3">
                  <button onClick={() => document.getElementById('fileInput').click()} className="bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-bold border border-slate-200 dark:border-slate-700">
                    <RefreshCw size={16} /> Replace
                  </button>
                  <button onClick={() => setImage(null)} className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-2xl shadow-lg transition-transform hover:scale-105">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className={`mt-8 flex flex-wrap gap-6 items-center p-6 rounded-[32px] border transition-all ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/50 border-slate-100'
              }`}>
                <div className="flex-1 min-w-[200px] space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Precision Zoom</span>
                    <span className="text-xs font-black text-blue-600">{Math.round(zoom * 100)}%</span>
                  </div>
                  <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(e.target.value)} className="w-full h-1.5 bg-blue-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
                <button 
                  onClick={processImage} 
                  disabled={isProcessing} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[22px] font-black flex items-center gap-3 shadow-xl shadow-blue-500/20 disabled:opacity-50 transition-all hover:scale-[1.02]"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : <Crop size={22} />} 
                  {isProcessing ? 'AI Processing...' : 'Finalize Photo'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: CONTROL CENTER */}
        <div className="lg:col-span-5 space-y-8">
          <div className={`p-10 rounded-[40px] border shadow-2xl space-y-8 transition-all ${
            darkMode ? 'bg-slate-900/40 border-slate-800 shadow-black' : 'bg-white/90 border-white'
          }`}>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue-600 border-b border-blue-50 pb-4">Studio Controls</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID Standard</label>
                <select className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                  {Object.entries(SIZES).map(([key, val]) => <option key={key} value={key}>{val.name}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sheet Size</label>
                <select className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={selectedSheet} onChange={(e) => setSelectedSheet(e.target.value)}>
                  {Object.entries(SHEET_SIZES).map(([key, val]) => <option key={key} value={key}>{val.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Background Tone</label>
              <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl w-fit border border-slate-100 dark:border-slate-700">
                {['#ffffff', '#357ABD', '#F5F5F5'].map(c => (
                  <button key={c} onClick={() => setBgColor(c)} className={`w-9 h-9 rounded-full border-2 transition-all ${bgColor === c ? 'border-blue-500 scale-125 shadow-lg' : 'border-white dark:border-slate-600 opacity-60'}`} style={{ backgroundColor: c }} />
                ))}
                <div className="w-[1px] bg-slate-200 dark:bg-slate-700 mx-2" />
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-9 h-9 p-0 border-0 bg-transparent cursor-pointer rounded-full overflow-hidden" />
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quantity on Sheet</label>
                <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-xl">{photoCount} Pcs</span>
              </div>
              <input type="range" min="1" max="24" value={photoCount} onChange={(e) => setPhotoCount(e.target.value)} className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </div>

            <button 
              disabled={!croppedImage} 
              onClick={handleDownload} 
              className="w-full py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] hover:bg-right text-white rounded-[28px] font-black text-lg shadow-[0_25px_50px_-12px_rgba(37,99,235,0.4)] active:scale-95 transition-all duration-500 disabled:opacity-20 disabled:shadow-none"
            >
              Export Studio PDF
            </button>
          </div>

          {/* DYNAMIC PAPER PREVIEW */}
          {croppedImage && (
            <div className={`p-8 rounded-[40px] border shadow-2xl transition-all ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-white shadow-blue-900/5'
            }`}>
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest text-center">Print Preview Layout</h3>
              <div 
                className="mx-auto bg-white border shadow-2xl p-4 flex flex-wrap content-start gap-1.5 justify-center rounded-sm transition-all duration-700"
                style={{
                  width: '210px',
                  aspectRatio: `${SHEET_SIZES[selectedSheet].width} / ${SHEET_SIZES[selectedSheet].height}`,
                }}
              >
                {[...Array(parseInt(photoCount))].map((_, i) => (
                  <div key={i} className="shadow-[0.5px_0.5px_2px_rgba(0,0,0,0.1)] border-[0.2px] border-slate-100" style={{ backgroundColor: bgColor, width: selectedSheet === 'A4' ? '18%' : '28%', aspectRatio: `${SIZES[selectedSize].width} / ${SIZES[selectedSize].height}` }}>
                    <img src={croppedImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER SECTION */}
<footer className={`relative mt-20 border-t transition-colors ${
  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-blue-100'
}`}>
  <div className="max-w-7xl mx-auto px-8 py-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      
      {/* Brand Column */}
      <div className="md:col-span-2 space-y-6">
        <div className="flex items-center gap-3 ">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Contact2 size={20} className="text-white" />
          </div>
          <h4 className='font-black text-xl'>Owned And Managed By - Samresh Singh</h4>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
          Premium Passport Photo Studio. We use AI technology to ensure your 
          government documents meet 100% of the legal requirements every time.
        </p>
        <div className="flex gap-4">
          {/* Social Icons Placeholder */}
          {['Facebook', 'Instagram', 'WhatsApp'].map((social) => (
            <a key={social} href="#" className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-indigo-500 transition-colors">
              {social}
            </a>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Services</h4>
        <ul className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <li className="hover:text-blue-600 cursor-pointer transition-colors">US Visa Photos</li>
          <li className="hover:text-blue-600 cursor-pointer transition-colors">Indian Passport</li>
          <li className="hover:text-blue-600 cursor-pointer transition-colors">Bulk Printing</li>
        </ul>
      </div>

      {/* Contact info */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Studio</h4>
        <ul className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <li>Open: 10AM — 8PM</li>
          <li className="text-blue-600 font-bold">kk.comm@studio.com</li>
          <li>+91 98765 43210</li>
        </ul>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        © 2026 K.K COMMUNICATION. ALL RIGHTS RESERVED.
      </p>
      
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600"
      >
        Back to top 
        <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
      </button>
    </div>
  </div>

  {/* Decorative bottom glow */}
  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
</footer>
    </div>
  );
}