export interface Synced {
  tick: () => void;
}

export interface ContextSynced {
  tick: (currTick: number) => void;
}
