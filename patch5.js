const fs = require('fs');
let code = fs.readFileSync('src/features/editor/components/Controls.tsx', 'utf8');

code = code.replace(
  /export const DownloadButton: React.FC<\{ onClick: \(\) => void \}> = \(\{ onClick \}\) => \(/g,
  `export const DownloadButton: React.FC<{ onClick: () => void; disabled?: boolean }> = ({ onClick, disabled }) => (`
);

code = code.replace(
  /className="brutal-button download-button"\n    onClick=\{onClick\}/g,
  `className={\`brutal-button download-button \${disabled ? 'disabled' : ''}\`}
    onClick={onClick}
    disabled={disabled}`
);

fs.writeFileSync('src/features/editor/components/Controls.tsx', code);
