export interface Destroyable {
  destroy(): void;
}

export interface DefferedDestroyable {
  deferDestroy(): void;
}
