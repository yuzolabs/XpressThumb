import React from 'react';
import './PreviewCanvasHost.css';

interface PreviewCanvasHostProps {
  state: any;
}

export const PreviewCanvasHost: React.FC<PreviewCanvasHostProps> = ({ state }) => {
  return (
    <div className="preview-canvas-host">
      <div className="canvas-wrapper" style={{
        aspectRatio: state.ratio.replace(':', '/')
      }}>
        <div className="placeholder-canvas">
          <div className="placeholder-info">
            <span className="info-label">CANVAS_RENDERER_PENDING</span>
            <div className="debug-state">
              [STATE_SNAPSHOT]
              <br />
              RATIO: {state.ratio}
              <br />
              FONT: {state.font} / {state.fontSize}px
              <br />
              COLOR: {state.color}
              <br />
              POS: {state.position}
              <br />
              BG: {state.backgroundMode}
              <br />
              TEXTURE: {state.pattern}
              <br />
              TEXT: {state.text || 'EMPTY'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
