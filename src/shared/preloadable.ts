import { Loader } from 'phaser';

export class Preloadable {
  protected static assetsPreloaded: boolean;
  protected static preload: (load: Loader.LoaderPlugin) => void;

  public static preloadWithLoader(load: Loader.LoaderPlugin) {
    if (this.assetsPreloaded) return;

    this.preload(load);
    this.assetsPreloaded = true;
  }

  constructor() {
    this.validateReloadCall();
  }

  private validateReloadCall(): void | never {
    if (!(<typeof Preloadable>this.constructor).assetsPreloaded) {
      throw Error(
        'Class resources not preloaded. Please call Class.preloadWithLoader(...)'
      );
    }
  }
}
