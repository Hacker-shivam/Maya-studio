import React from 'react';

export default function LayoutGrid({ image, count, bgColor, photoSize }) {
  // CSS mm units are great for real-world scale previews
  const style = {
    backgroundColor: bgColor,
    width: `${photoSize.width}mm`,
    height: `${photoSize.height}mm`,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  };

  return (
    <div className="bg-white p-8 border shadow-inner min-h-[400px] flex flex-wrap gap-3 justify-center content-start overflow-auto rounded-lg">
      {[...Array(count)].map((_, i) => (
        <div key={i} style={style} className="overflow-hidden border border-slate-100">
          {image && <img src={image} className="w-full h-full object-cover" alt="Passport" />}
        </div>
      ))}
    </div>
  );
}