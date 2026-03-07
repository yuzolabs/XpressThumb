const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

code = code.replace(
  /const handleDownload = \(\) => \{/g,
  `const handleDownload = () => {
    if (state.validation.textOverflow) {
      alert('Cannot export: Text exceeds canvas boundaries');
      return;
    }`
);

code = code.replace(
  /<DownloadButton onClick=\{handleDownload\} \/>/g,
  `<DownloadButton onClick={handleDownload} disabled={state.validation.textOverflow} />`
);

code = code.replace(
  /<PreviewCanvasHost state=\{current\} \/>/g,
  `<PreviewCanvasHost state={current} onOverflowChange={v => dispatch({ type: 'SET_VALIDATION_TEXT_OVERFLOW', payload: v })} />`
);

fs.writeFileSync('src/app/App.tsx', code);
