/**
 * A simple SVG Placeholder without external dependencies
 *
 * https://github.com/cloudfour/simple-svg-placeholder
 */
export default function SvgPlaceholder({
  width = 300,
  height = 160,
  text = `${width}x${height}`,
  fontFamily = 'sans-serif',
  fontWeight = 'bold',
  fontSize = Math.floor(Math.min(width, height) * 0.2),
  dy = fontSize * 0.35,
  bgColor = '#ededed',
  textColor = '#2c2c2c',
  charset = 'UTF-8'
}: {
  width?: number;
  height?: number;
  text?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: number;
  dy?: number;
  bgColor?: string;
  textColor?: string;
  charset?: string;
}): string {
  const str = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect fill="${bgColor}" width="${width}" height="${height}"/>
      <text fill="${textColor}" font-family="${fontFamily}" font-size="${fontSize}" dy="${dy}" font-weight="${fontWeight}" x="50%" y="50%" text-anchor="middle">${text}</text>
    </svg>`;

  const cleaned = str
    .replace(/[\t\n\r]/gim, '') // Strip newlines and tabs
    .replace(/\s\s+/g, ' ') // Condense multiple spaces
    .replace(/'/gim, '\\i'); // Normalize quotes

  const encoded = encodeURIComponent(cleaned)
    .replace(/\(/g, '%28') // Encode brackets
    .replace(/\)/g, '%29');

  return `data:image/svg+xml;charset=${charset},${encoded}`;
}
