'use client';

interface ExifData {
  camera?: string;
  lens?: string;
  focalLength?: number;
  aperture?: number;
  shutterSpeed?: string;
  iso?: number;
  dateTime?: string;
  latitude?: number;
  longitude?: number;
}

interface ExifDisplayProps {
  metadata?: {
    exif?: ExifData;
    [key: string]: any;
  };
}

export default function ExifDisplay({ metadata }: ExifDisplayProps) {
  const exif = metadata?.exif;
  
  if (!exif || Object.keys(exif).length === 0) {
    return null;
  }
  
  return (
    <div className="bg-black/50 border border-green-900 rounded p-4 space-y-2">
      <h4 className="text-sm font-semibold text-green-400 mb-2">Camera Information</h4>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {exif.camera && (
          <>
            <span className="text-gray-400">Camera:</span>
            <span className="text-green-300">{exif.camera}</span>
          </>
        )}
        
        {exif.lens && (
          <>
            <span className="text-gray-400">Lens:</span>
            <span className="text-green-300">{exif.lens}</span>
          </>
        )}
        
        {exif.focalLength && (
          <>
            <span className="text-gray-400">Focal Length:</span>
            <span className="text-green-300">{exif.focalLength}mm</span>
          </>
        )}
        
        {exif.aperture && (
          <>
            <span className="text-gray-400">Aperture:</span>
            <span className="text-green-300">f/{exif.aperture}</span>
          </>
        )}
        
        {exif.shutterSpeed && (
          <>
            <span className="text-gray-400">Shutter Speed:</span>
            <span className="text-green-300">{exif.shutterSpeed}s</span>
          </>
        )}
        
        {exif.iso && (
          <>
            <span className="text-gray-400">ISO:</span>
            <span className="text-green-300">{exif.iso}</span>
          </>
        )}
        
        {exif.dateTime && (
          <>
            <span className="text-gray-400">Taken:</span>
            <span className="text-green-300">
              {new Date(exif.dateTime).toLocaleDateString()}
            </span>
          </>
        )}
        
        {(exif.latitude && exif.longitude) && (
          <>
            <span className="text-gray-400">Location:</span>
            <span className="text-green-300">
              {exif.latitude.toFixed(4)}, {exif.longitude.toFixed(4)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
