import React, { useEffect, useRef, useState } from 'react';
import './PreviewCanvasHost.css';
import { EditorConfig } from '../../../shared/types/editor';
import { renderThumbnail, areFontsReady, waitForFonts, AssetCache } from '../render/renderer';
import dotPatternSvg from '../../../assets/patterns/dot.svg?raw';
import gridPatternSvg from '../../../assets/patterns/grid.svg?raw';
import noisePatternSvg from '../../../assets/patterns/noise.svg?raw';

const PATTERNS: Record<string, string> = {
  dot: dotPatternSvg,
  grid: gridPatternSvg,
  noise: noisePatternSvg,
};

interface PreviewCanvasHostProps {
  state: EditorConfig;
  onOverflowChange?: (overflow: boolean) => void;
}

export const PreviewCanvasHost: React.FC<PreviewCanvasHostProps> = ({ state, onOverflowChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [overflow, setOverflow] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const assetsRef = useRef<AssetCache>({ backgroundImage: null, overlayImage: null, patternImage: null });

  useEffect(() => {
    let isActive = true;
    const render = async () => {
      if (!canvasRef.current) return;

      if (!areFontsReady([state.text.font])) {
        await waitForFonts([state.text.font]);
      }

      if (!isActive) return;

      if (state.background.mode === 'image' && state.background.objectUrl) {
        if (assetsRef.current.backgroundImage?.src !== state.background.objectUrl) {
          const img = new Image();
          img.src = state.background.objectUrl;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
          assetsRef.current.backgroundImage = img;
        }
      } else {
        assetsRef.current.backgroundImage = null;
      }

      if (state.pattern.type !== 'none' && PATTERNS[state.pattern.type]) {
        const rawSvg = PATTERNS[state.pattern.type];
        const coloredSvg = rawSvg.replace(/currentColor/g, state.pattern.color);
        const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(coloredSvg)}`;

        if (assetsRef.current.patternImage?.src !== dataUrl) {
          const img = new Image();
          img.src = dataUrl;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
          assetsRef.current.patternImage = img;
        }
      } else {
        assetsRef.current.patternImage = null;
      }

      if (state.overlay.objectUrl) {
        if (assetsRef.current.overlayImage?.src !== state.overlay.objectUrl) {
          const img = new Image();
          img.src = state.overlay.objectUrl;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
          assetsRef.current.overlayImage = img;
        }
      } else {
        assetsRef.current.overlayImage = null;
      }

      if (!isActive) return;
      const result = renderThumbnail(state, assetsRef.current, canvasRef.current, 'preview');
      setOverflow(result.textOverflow);
      setErrorMsg(result.error);
      if (onOverflowChange) {
        onOverflowChange(result.textOverflow);
      }
    };

    render();

    return () => {
      isActive = false;
    };
  }, [state]);

  const hasWarning = overflow || errorMsg;

  return (
    <div className="preview-canvas-host" data-testid="preview-canvas-host">
      <div className="canvas-stage">
        <div
          className="canvas-frame canvas-wrapper"
          data-testid="canvas-wrapper"
          style={{ aspectRatio: state.ratio.replace(':', '/') }}
        >
          <canvas
            ref={canvasRef}
            className="preview-canvas"
            role="img"
            aria-label="Thumbnail preview"
          />
        </div>
      </div>

      {hasWarning && (
        <div className="status-banner-container">
          {errorMsg && (
            <div className="status-banner status-banner--error" role="alert">
              <svg className="status-banner__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span className="status-banner__text">{errorMsg}</span>
            </div>
          )}

          {overflow && (
            <div className="status-banner status-banner--warning overflow-warning" data-testid="overflow-warning" role="alert">
              <svg className="status-banner__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span className="status-banner__text">
                Text exceeds canvas boundaries. Please reduce font size or text length.
              </span>
            </div>
          )}
        </div>
      )}

      <div className="canvas-meta">
        <span className="canvas-dimensions">{state.ratio}</span>
        <span className="canvas-divider">·</span>
        <span className="canvas-status">
          {hasWarning ? 'Needs attention' : 'Ready to export'}
        </span>
      </div>
    </div>
  );
};
