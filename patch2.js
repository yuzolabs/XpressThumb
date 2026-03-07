const fs = require('fs');
let code = fs.readFileSync('src/features/editor/render/renderer.ts', 'utf8');

code = code.replace(
  /switch \(position\) \{\n    case 'top-left':\n    case 'top':\n    case 'top-right':\n      y = padding \+ textHeight;\n      break;\n    case 'left':\n    case 'center':\n    case 'right':\n      y = \(canvasHeight \+ textHeight\) \/ 2;\n      break;\n    case 'bottom-left':\n    case 'bottom':\n    case 'bottom-right':\n      y = canvasHeight - padding;\n      break;\n    default:\n      y = \(canvasHeight \+ textHeight\) \/ 2;\n  \}/g,
  `switch (position) {
    case 'top-left':
    case 'top':
    case 'top-right':
      y = padding;
      break;
    case 'left':
    case 'center':
    case 'right':
      y = (canvasHeight - textHeight) / 2;
      break;
    case 'bottom-left':
    case 'bottom':
    case 'bottom-right':
      y = canvasHeight - padding - textHeight;
      break;
    default:
      y = (canvasHeight - textHeight) / 2;
  }`
);

fs.writeFileSync('src/features/editor/render/renderer.ts', code);
