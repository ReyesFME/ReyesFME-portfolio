import React, { useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';

// Shows a .docx (with its images, tables and styling) inside the viewer window.
const DocxViewer = ({ project }) => {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    fetch(project.docxUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.arrayBuffer();
      })
      .then((buffer) => {
        if (cancelled || !containerRef.current) return undefined;
        containerRef.current.innerHTML = '';
        return renderAsync(buffer, containerRef.current, null, {
          inWrapper: true,
          breakPages: true,
          ignoreLastRenderedPageBreak: false,
        });
      })
      .then(() => { if (!cancelled) setStatus('ready'); })
      .catch((err) => {
        console.error('[DocxViewer]', err);
        if (!cancelled) setStatus('error');
      });

    return () => { cancelled = true; };
  }, [project.docxUrl]);

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        width: '100%',
        overflow: 'auto',
        background: '#2a2a2a',
        color: '#c0c0c0',
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
      }}
    >
      {status === 'loading' && <p style={{ padding: 16 }}>Loading document…</p>}
      {status === 'error' && (
        <p style={{ padding: 16 }}>
          Could not load this document. Check that the file exists at {project.docxUrl}.
        </p>
      )}
      <div ref={containerRef} />
    </div>
  );
};

export default DocxViewer;