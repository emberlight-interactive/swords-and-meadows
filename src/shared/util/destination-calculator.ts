export function destinationCalculator(
  startX: number,
  startY: number,
  angle: number,
  distance: number
): { x: number; y: number } {
  return {
    x:
      distance * Math.cos((Math.PI * 2 * ((angle + 360) % 360)) / 360) + startX,
    y:
      distance * Math.sin((Math.PI * 2 * ((angle + 360) % 360)) / 360) + startY,
  };
}
