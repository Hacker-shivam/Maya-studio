import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { Scissors, Check } from 'lucide-react';

export default function CropperModal({ image, aspect, onComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2"><Scissors size={18}/> Adjust Crop</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">Cancel</button>
        </div>
        
        <div className="relative h-[400px] w-full bg-black">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
          />
        </div>

        <div className="p-6 bg-slate-50 flex flex-col gap-4">
          <input 
            type="range" min="1" max="3" step="0.1" 
            value={zoom} onChange={(e) => setZoom(e.target.value)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <button 
            onClick={() => onComplete(croppedAreaPixels)}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700"
          >
            <Check size={20} /> Finish Cropping
          </button>
        </div>
      </div>
    </div>
  );
}