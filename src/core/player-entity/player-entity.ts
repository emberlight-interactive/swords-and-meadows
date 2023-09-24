import { Scene } from 'phaser';
import { XYTransformable } from '~/shared/models/x-y-transformable';
import { Destroyable } from '~/shared/models/destroyable';
import greyWizard from '../../shared/assets/grey-wizard.png';
import { HealthTrackable } from '../../shared/models/health-trackable';
import { playerDefaultHealth } from '../../shared/network/player';

export class PlayerEntity
  implements XYTransformable, Destroyable, HealthTrackable
{
  private player: Phaser.GameObjects.Sprite;
  private playerName: Phaser.GameObjects.DOMElement;
  private anchorOneOffset = { x: -13, y: 2 };

  public static preload(load: Phaser.Loader.LoaderPlugin) {
    load.image('player', greyWizard);
  }

  public get x() {
    return this.player.x;
  }

  public set x(value) {
    this.player.x = value;
    this.playerName.x = value;
    this.updateToolPosition();
  }

  public get y() {
    return this.player.y;
  }

  public set y(value) {
    this.player.y = value;
    this.playerName.y = value - 30;
    this.updateToolPosition();
  }

  private _health = playerDefaultHealth;
  public set health(value: number) {
    if (value !== this._health) {
      this._health = value;
      this.renderNewHealthPercentage((value / playerDefaultHealth) * 100);
    }
  }

  public get health() {
    return this._health;
  }

  constructor(
    x: number,
    y: number,
    private tool: XYTransformable,
    private scene: Scene
  ) {
    this.player = this.scene.add.sprite(x, y, 'player');
    this.playerName = this.scene.add.dom(
      x,
      y,
      'div',
      'background-color: #0000005A; height: 10px; font: 8px Arial; padding: 1px 8px 0 8px; color: white;border-bottom: 1px solid red;border-image: linear-gradient(to right, rgb(255, 0, 0) 100%, rgba(255, 0, 0, 0) 100%) 1 / 1 / 0 stretch; border-image-slice: 1;',
      'texxxxx27'
    );
    this.playerName.pointerEvents = 'none';
    this.updateToolPosition();
  }

  private updateToolPosition() {
    this.tool.x = this.x + this.anchorOneOffset.x;
    this.tool.y = this.y + this.anchorOneOffset.y;
  }

  public destroy(): void {
    this.player.destroy();
  }

  private renderNewHealthPercentage(healthPercentage: number) {
    (<HTMLElement>(
      this.playerName.node
    )).style.borderImage = `linear-gradient(to right, #F00 ${healthPercentage}%, rgba(255,0,0,0) ${healthPercentage}%) 1 / 1 / 0 stretch`;
  }
}
