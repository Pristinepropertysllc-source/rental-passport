'use client';

import { useState } from 'react';
import { upload } from '@vercel/blob/client';

export function AdminScreeningUpload({ passportId }: { passportId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setStatus('uploading');
    setErrorMsg('');

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/screening-upload-token'
      });

      const res = await fetch('/api/admin/screening-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passportId, url: blob.url, filename: file.name })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Upload failed');
      }

      window.location.reload();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          type="file"
          required
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button className="btn btn-primary btn-sm" type="submit" disabled={status === 'uploading'}>
          {status === 'uploading' ? 'Uploading…' : 'Upload report'}
        </button>
      </div>
      {status === 'error' && <span style={{ color: 'var(--danger)', fontSize: 13 }}>{errorMsg}</span>}
    </form>
  );
}
