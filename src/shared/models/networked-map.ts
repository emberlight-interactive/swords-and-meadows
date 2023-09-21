type TrackedObject<T> = T & {
  onChange(callback: () => void): void;
  onRemove(callback: () => void): void;
};

export interface NetworkedMap<T> {
  onAdd(callback: (state: TrackedObject<T>, key: string) => void): void;
  onRemove(callback: (item: T, key: string) => void): void;
}
