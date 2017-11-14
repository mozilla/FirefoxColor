export const colorToCSS = color => {
  const [h, s, l] = [color.h, Math.floor(color.s), Math.floor(color.l)];
  return typeof color.a === 'undefined'
    ? `hsl(${h}, ${s}%, ${l}%)`
    : `hsla(${h}, ${s}%, ${l}%, ${color.a * 0.01})`;
};
