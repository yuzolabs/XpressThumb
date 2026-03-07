const fs = require('fs');
let code = fs.readFileSync('src/features/editor/components/PreviewCanvasHost.tsx', 'utf8');

code = code.replace(
  /interface PreviewCanvasHostProps \{\n  state: EditorConfig;\n\}/g,
  `interface PreviewCanvasHostProps {
  state: EditorConfig;
  onOverflowChange?: (overflow: boolean) => void;
}`
);

code = code.replace(
  /export const PreviewCanvasHost: React.FC<PreviewCanvasHostProps> = \(\{ state \}\) => \{/g,
  `export const PreviewCanvasHost: React.FC<PreviewCanvasHostProps> = ({ state, onOverflowChange }) => {`
);

code = code.replace(
  /setOverflow\(result.textOverflow\);\n      setErrorMsg\(result.error\);/g,
  `setOverflow(result.textOverflow);
      setErrorMsg(result.error);
      if (onOverflowChange) {
        onOverflowChange(result.textOverflow);
      }`
);

fs.writeFileSync('src/features/editor/components/PreviewCanvasHost.tsx', code);
