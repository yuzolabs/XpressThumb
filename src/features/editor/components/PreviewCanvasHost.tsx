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
      
      // Ensure fonts are loaded before rendering
      if (!areFontsReady([state.text.font])) {
        await waitForFonts([state.text.font]);
      }

      if (!isActive) return;

      // Sync background image asset if needed
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

      // Sync pattern image asset if needed
      if (state.pattern.type !== 'none' && PATTERNS[state.pattern.type]) {
        const rawSvg = PATTERNS[state.pattern.type];
        const coloredSvg = rawSvg.replace(/currentColor/g, state.pattern.color);
        
        // Use encodeURIComponent to create a reliable data URL that can be easily compared
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

      // Sync overlay image asset if needed
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

  return (
    <div className="preview-canvas-host">
      <div className="canvas-wrapper" style={{
        aspectRatio: state.ratio.replace(':', '/')
      }}>
        <canvas ref={canvasRef} className="preview-canvas" />
        {errorMsg && (
          <div className="error-warning" style={{ color: "red", marginTop: "10px" }}>
            ⚠️ {errorMsg}
          </div>
        )}
        {overflow && (
          <div className="overflow-warning">
            ⚠️ Text exceeds canvas boundaries. Please reduce font size or text length.
          </div>
        )}
      </div>
    </div>
  );
};
