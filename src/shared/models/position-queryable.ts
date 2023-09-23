export interface PositionQueryable<T> {
  getNearby(
    point: { x: number; y: number },
    count: number,
    maxDistance: number
  ): [T, number][];
}
