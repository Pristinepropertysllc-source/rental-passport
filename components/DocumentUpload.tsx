'use client';

import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

function UploadStatus({ fileName }: { fileName: string }) {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return (
    <span className="doc-uploading" role="status">
      Uploading&hellip; {fileName}
    </span>
  );
}

// Picking a file uploads it right away -- there is no separate Upload button.
export function DocumentUpload({
  action,
  docType,
  buttonLabel,
  uploaded
}: {
  action: (formData: FormData) => void | Promise<void>;
  docType: string;
  buttonLabel: string;
  uploaded: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState('');

  async function handleAction(formData: FormData) {
    await action(formData);
    formRef.current?.reset();
    setFileName('');
  }

  return (
    <form ref={formRef} action={handleAction} className="doc-cat-form">
      <input type="hidden" name="type" value={docType} />
      <label className={`btn btn-sm doc-pick ${uploaded ? 'btn-primary' : 'btn-secondary'}`}>
        {uploaded ? 'Upload another' : buttonLabel}
        <input
          className="doc-file-input"
          name="file"
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setFileName(file.name);
            formRef.current?.requestSubmit();
          }}
        />
      </label>
      <UploadStatus fileName={fileName} />
    </form>
  );
}
