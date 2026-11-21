// Anatomy-style body: one black silhouette with white muscle lines, front and back.
// Muscle groups are filled underneath the lines, so the drawing stays clean whatever is lit.
// Coordinates are for one 200 x 440 figure; the left half is drawn and mirrored.

const MIRROR = 'matrix(-1 0 0 1 200 0)';

// Left half of the outline, from the top of the head down to the crotch (cubic segments).
const OUTLINE_L = [
  [100, 6], [86, 6, 78, 15.2, 78, 28.2], [78, 39.2, 81, 48.5, 87, 54], [88, 58.7, 88, 65.2, 87, 70.9],
  [76, 76.5, 60, 78.4, 50, 84], [34, 89.5, 28, 113.3, 37, 136.4], [33, 149.1, 31, 164.2, 33, 178.5], [28, 191.2, 27, 211.5, 31, 233.6],
  [27, 243.2, 25, 260.4, 30, 273.3], [35, 278.7, 41, 276.6, 43, 269], [45, 258.3, 44, 243.2, 42, 234.5], [49, 213.9, 54, 196.1, 53, 179.4],
  [55, 164.2, 57, 144, 58, 128.8], [62, 148.2, 68, 173.5, 71, 192], [72, 201.8, 67, 209.9, 63, 218], [48.4, 242.2, 48.4, 287.3, 61.2, 327.8],
  [62.4, 334.2, 61.2, 340.5, 62.4, 346], [53.1, 369.7, 58.9, 399.2, 69.3, 414], [64.7, 421.1, 64.7, 430.5, 74, 430.5], [83.2, 431.7, 91.4, 429.4, 91.4, 423.5],
  [90.2, 416.4, 89, 411, 89, 405.1], [96, 381.5, 94.8, 357.8, 91.4, 346], [93.7, 338.7, 93.7, 331.5, 92.5, 326], [99.5, 293.8, 100.5, 261.5, 100.5, 240],
];
function outlinePath() {
  const [start, ...segs] = OUTLINE_L;
  let d = `M${start[0]} ${start[1]}`;
  for (const s of segs) d += `C${s.join(' ')}`;
  // The right half: the same segments mirrored and walked back up to the head.
  const pts = [start, ...segs.map((s) => [s[4], s[5]])];
  for (let i = segs.length - 1; i >= 0; i--) {
    const s = segs[i], p0 = pts[i];
    d += `C${200 - s[2]} ${s[3]} ${200 - s[0]} ${s[1]} ${200 - p0[0]} ${p0[1]}`;
  }
  return `${d}Z`;
}
const OUTLINE = outlinePath();

// Muscle lines (left half, mirrored) and center lines.
const LINES = {
  front: [
    'M87 42.9 C90 55.9 95 69 98 78.4', 'M99 80.2 C88 78.4 70 79.3 50 84.9', 'M66 81.2 C58 96.8 50 118.8 41 136.4', 'M55 111.5 C57 129.7 80 134.7 99 130.5',
    'M80 134.7 C78 163.4 79 192.8 85 219.8', 'M80 151.6 C88 149.9 95 151.6 100 150.7', 'M79 170.1 C88 168.4 95 170.1 100 169.3', 'M80 189.5 C88 187.8 95 189.5 100 188.6',
    'M66 209.9 C74 219.8 86 229 98 234.5', 'M60 138.1 L68 143.2', 'M61 148.2 L69 153.3', 'M62 158.3 L69 163.4',
    'M41 139.8 C38 153.3 37 165.1 39 176.8', 'M55 134.7 C55 151.6 53 165.1 50 176.8', 'M35 179.4 C41 182.7 47 182.7 52 180.2', 'M38 184.4 C40 199.3 40 213.9 38 229.9',
    'M32 233.6 C36 236.3 40 236.3 42 234.5', 'M34 261.5 L33 272.2', 'M38 263.6 L38 274.4', 'M42 260.4 L42 269',
    'M60 225.3 C64.7 255.1 67 293.8 69.3 321.7', 'M62.4 219.8 C77.4 242.2 86.7 272.2 91.4 313.1', 'M86.7 298.1 C82.1 306.6 83.2 317.4 89 324.9',
    'M71.6 329.6 C70.5 334.2 72.8 338.7 77.4 339.6 C82.1 338.7 84.4 334.2 83.2 329.6 C82.1 326.9 72.8 326.9 71.6 329.6', 'M70.5 349 C69.3 375.6 71.6 393.3 76.3 411', 'M70.5 414 C76.3 416.4 82.1 416.4 87.9 412.5',
  ],
  frontCenter: ['M100 80.2 L100 221.7', 'M98 180.2 a2 3 0 1 0 4 0 a2 3 0 1 0 -4 0'],
  back: [
    'M58 87.7 C70 93.2 84 104.2 92 117 C96 126.2 99 133.1 100 138.1', 'M58 87.7 C50 100.5 46 118.8 43 134.7', 'M61 96.8 C70 98.7 80 102.3 87 108.8', 'M87 108.8 C86 118.8 83 126.2 78 131.4', 'M78 131.4 C72 134.7 66 133.1 61 128.8',
    'M60 128.8 C70 136.4 82 143.2 91 149.1', 'M69 188.6 C78 196.9 88 201.8 99 204.2', 'M92 151.6 C90 173.5 90 192 92 209.9',
    'M63 216.4 C76 211.5 90 213.1 100 218', 'M56.6 252.9 C72.8 264.7 89 264.7 99.5 258.3', 'M79.8 265.8 C78.6 289.4 77.4 308.8 77.4 323.9', 'M62.4 327.8 C72.8 331.5 84.4 331.5 91.4 327.8',
    'M77.4 349 C77.4 366.7 77.4 381.5 77.4 390.3', 'M61.2 375.6 C70.5 393.3 77.4 396.3 77.4 390.3', 'M92.5 375.6 C86.7 393.3 79.8 396.3 77.4 390.3', 'M77.4 393.3 L77.4 411',
    'M40 139.8 C42 153.3 44 165.1 48 175.2', 'M55 134.7 C53 149.9 52 163.4 50 175.2', 'M35 179.4 C41 181.9 47 181.9 52 179.4', 'M38 186.1 C40 200.9 40 215.6 38 229.9',
    'M32 233.6 C36 236.3 40 236.3 42 234.5',
  ],
  backCenter: ['M100 59.6 L100 138.1', 'M100 138.1 L100 218', 'M100.5 218 L100.5 259.4'],
};

// Filled areas for each muscle group (left half; clipped to the body, hidden under the lines).
const AREAS = {
  front: {
    back: ['M87 71.8 L76 76.5 L60 78.4 L50 84.9 L66 81.2 L85 78.4 L99 79.3 L99 70.9Z'],
    shoulders: ['M50 84.9 L66 81.2 L58 96.8 L50 118.8 L41 136.4 L35 130.5 L29 109.7 L36 91.3Z'],
    chest: ['M99 80.2 L66 81.2 L58 96.8 L55 111.5 L59 128 L80 134.7 L99 130.5Z'],
    arms: ['M37 134.7 L41 136.4 L58 128.8 L56 163.4 L53 178.5 L42 233.6 L31 233.6 L27 209.9 L31 180.2 L33 146.5Z'],
    core: ['M99 130.5 L80 134.7 L59 128 L62 146.5 L71 192 L72 201.8 L67 209.9 L63 218 L98 236.3 L100 236.3 L100 130.5Z'],
    legs: ['M57.7 218 L98.3 236.3 L100.5 240 L93.7 346 L62.4 346 L48.4 272.2Z', 'M61.2 326 L92.5 326 L96 375.6 L89 405.1 L69.3 414 L53.1 384.4Z'],
  },
  back: {
    back: ['M100 57.8 L87 70.9 L50 84.9 L58 87.7 L54 104.2 L48 118.8 L58 128.8 L62 138.1 L71 192 L72 201.8 L67 209.9 L63 218 L100 218Z'],
    shoulders: ['M50 84.9 L58 87.7 L54 104.2 L48 118.8 L43 134.7 L35 130.5 L29 109.7 L36 91.3Z'],
    arms: ['M37 134.7 L41 136.4 L58 128.8 L56 163.4 L53 178.5 L42 233.6 L31 233.6 L27 209.9 L31 180.2 L33 146.5Z'],
    hinge: ['M57.7 218 L100.5 218 L100.5 259.4 L89 264.7 L72.8 264.7 L56.6 252.9 L49.6 232.7Z', 'M56.6 252.9 L99.5 259.4 L93.7 335.1 L61.2 335.1 L48.4 283Z'],
    legs: ['M61.2 327.8 L92.5 327.8 L96 375.6 L89 405.1 L69.3 414 L53.1 384.4Z'],
  },
};

let uid = 0;
function figure(side, state) {
  const id = `bm${++uid}`;
  const areas = Object.entries(AREAS[side]).map(([g, list]) => {
    const shapes = list.map((d) => `<path d="${d}"/><path d="${d}" transform="${MIRROR}"/>`).join('');
    return `<g class="bm-g ${state[g] || ''}">${shapes}</g>`;
  }).join('');
  const lines = LINES[side].map((d) => `<path d="${d}"/><path d="${d}" transform="${MIRROR}"/>`).join('');
  const center = LINES[side + 'Center'].map((d) => `<path d="${d}"/>`).join('');
  return `<defs><clipPath id="${id}"><path d="${OUTLINE}"/></clipPath></defs>
    <path d="${OUTLINE}" class="bm-body"/>
    <g clip-path="url(#${id})">${areas}</g>
    <g class="bm-line">${lines}${center}</g>
    <path d="${OUTLINE}" class="bm-out"/>`;
}

// view: 'both' (front and back side by side), 'front' or 'back'.
export function bodySvg(state = {}, view = 'both', cls = '') {
  const both = view === 'both';
  const front = view !== 'back' ? `<g>${figure('front', state)}</g>` : '';
  const back = view !== 'front' ? `<g transform="translate(${both ? 210 : 0} 0)">${figure('back', state)}</g>` : '';
  return `<svg class="bmap ${cls}" viewBox="0 0 ${both ? 410 : 200} 438" aria-hidden="true">${front}${back}</svg>`;
}
