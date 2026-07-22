import React, { useState } from 'react';
import { Camera, UploadCloud } from 'lucide-react';
import { api } from '../../services/api';

interface ImageUploaderProps {
  employeeId: string;
  currentAvatarUrl?: string;
  onUploadSuccess: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ employeeId, currentAvatarUrl, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post(`/employees/${employeeId}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploadSuccess(res.data.avatar_url);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload profile photo.');
    } finally {
      setUploading(false);
    }
  };

  const getFullAvatarUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://localhost:8000${url}`;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 group shadow-xs">
        {currentAvatarUrl ? (
          <img src={getFullAvatarUrl(currentAvatarUrl)!} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Camera className="w-8 h-8" />
          </div>
        )}

        <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white">
          <UploadCloud className="w-6 h-6 text-white" />
          <span className="text-[10px] font-semibold mt-1">{uploading ? 'Uploading...' : 'Change Photo'}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
        </label>
      </div>

      {error && <p className="text-[10px] text-rose-600 font-medium">{error}</p>}
    </div>
  );
};
