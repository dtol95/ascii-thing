import { CP437_MAP, DEFAULT_ATLAS_CONFIG, type GlyphAtlasConfig } from './glyphAtlas';

export function generateFontTexture(config: GlyphAtlasConfig = DEFAULT_ATLAS_CONFIG): HTMLCanvasElement {
  const { glyphWidth, glyphHeight, columns, rows } = config;
  const canvas = document.createElement('canvas');
  canvas.width = glyphWidth * columns;
  canvas.height = glyphHeight * rows;
  
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.font = `${glyphHeight - 2}px monospace`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  for (let i = 0; i < CP437_MAP.length && i < columns * rows; i++) {
    const char = CP437_MAP[i];
    const x = (i % columns) * glyphWidth;
    const y = Math.floor(i / columns) * glyphHeight;
    
    if (i >= 176 && i <= 178) {
      drawShadePattern(ctx, x, y, glyphWidth, glyphHeight, i - 175);
    } else if (i === 219) {
      ctx.fillRect(x, y, glyphWidth, glyphHeight);
    } else if (i >= 196 && i <= 218) {
      drawBoxDrawing(ctx, x, y, glyphWidth, glyphHeight, i);
    } else {
      ctx.fillText(char, x + glyphWidth / 2, y + glyphHeight / 2);
    }
  }
  
  return canvas;
}

function drawShadePattern(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, level: number) {
  const density = level * 0.25;
  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      if (Math.random() < density) {
        ctx.fillRect(x + px, y + py, 1, 1);
      }
    }
  }
}

function drawBoxDrawing(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, code: number) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  
  switch(code) {
    case 196:
      ctx.beginPath();
      ctx.moveTo(x, cy);
      ctx.lineTo(x + w, cy);
      ctx.stroke();
      break;
    case 179:
      ctx.beginPath();
      ctx.moveTo(cx, y);
      ctx.lineTo(cx, y + h);
      ctx.stroke();
      break;
    case 218:
      ctx.beginPath();
      ctx.moveTo(cx, y + h);
      ctx.lineTo(cx, cy);
      ctx.lineTo(x + w, cy);
      ctx.stroke();
      break;
    case 191:
      ctx.beginPath();
      ctx.moveTo(cx, y + h);
      ctx.lineTo(cx, cy);
      ctx.lineTo(x, cy);
      ctx.stroke();
      break;
    case 192:
      ctx.beginPath();
      ctx.moveTo(cx, y);
      ctx.lineTo(cx, cy);
      ctx.lineTo(x + w, cy);
      ctx.stroke();
      break;
    case 217:
      ctx.beginPath();
      ctx.moveTo(cx, y);
      ctx.lineTo(cx, cy);
      ctx.lineTo(x, cy);
      ctx.stroke();
      break;
    case 197:
      ctx.beginPath();
      ctx.moveTo(x, cy);
      ctx.lineTo(x + w, cy);
      ctx.moveTo(cx, y);
      ctx.lineTo(cx, y + h);
      ctx.stroke();
      break;
    default:
      ctx.fillText(CP437_MAP[code], cx, cy);
  }
}