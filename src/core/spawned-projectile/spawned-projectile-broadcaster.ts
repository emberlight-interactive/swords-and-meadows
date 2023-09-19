// import { Scene } from 'phaser';
// import { XYTransformable } from '../../shared/entities/x-y-transformable';
// import { NetworkBroadcastEntity } from '../../shared/network/client-network-manager';
// import { NetworkCommKey } from '../../shared/network/networked-state/networked-state';
// import {
//   IPlayerInput,
//   PlayerNetworkedStateBundle,
//   IPlayerState,
//   playerStateModification,
//   wandPivotOffset,
// } from '../../shared/network/networked-state/player-networked-state';
// import { Destroyable } from '../../shared/entities/destroyable';
// import { ObjectCollectionBuffer } from '../../shared/util/object-collection-buffer';
// import { InputHandler } from '../../shared/entities/input-handler';
// import { Rotatable } from '../../shared/entities/rotatable';

// type Key = Phaser.Input.Keyboard.Key;

// export class SpawnedProjectileInputHandler implements InputHandler<IPlayerInput> {
//   private keys!: { W: Key; A: Key; S: Key; D: Key };

//   private playerInput: IPlayerInput = {
//     left: false,
//     right: false,
//     up: false,
//     down: false,
//     tick: 0,
//     relativeMouseAngle: 0,
//   };

//   private playerInputBuffer = new ObjectCollectionBuffer<IPlayerInput>();

//   constructor(
//     private scene: Scene,
//     private relativeMouseTarget: XYTransformable,
//     private keepInputHistory = true
//   ) {
//     this.scene.input.on('pointerdown', (v) => console.log(v));
//   }

//   public getBuffer() {
//     return this.playerInputBuffer;
//   }

//   public updateCurrentInput(currentTick: number): IPlayerInput {
//     this.playerInput.left = this.keys.A.isDown;
//     this.playerInput.right = this.keys.D.isDown;
//     this.playerInput.up = this.keys.W.isDown;
//     this.playerInput.down = this.keys.S.isDown;

//     const dx =
//       this.scene.game.input.activePointer.x - this.relativeMouseTarget.x;
//     const dy =
//       this.scene.game.input.activePointer.y - this.relativeMouseTarget.y;

//     this.playerInput.relativeMouseAngle =
//       (360 / (2 * Math.PI)) * Math.atan2(dy, dx);

//     this.playerInput.tick = currentTick;

//     if (this.keepInputHistory) this.playerInputBuffer.add(this.playerInput);

//     return this.playerInput;
//   }

//   public getCurrentInput(): IPlayerInput {
//     return this.playerInput;
//   }
// }

// export class SpawnedProjectileBroadcasterEntity
//   implements NetworkBroadcastEntity<PlayerNetworkedStateBundle>
// {
//   public readonly networkCommKey = NetworkCommKey.PlayerState;
//   private playerInputHandler: InputHandler<IPlayerInput>;

//   private state: IPlayerState = ((parentThis: PlayerBroadcasterEntity) => {
//     return new (class {
//       public get x() {
//         return parentThis.playerEntity.x;
//       }
//       public set x(value) {
//         parentThis.playerEntity.x = value;
//       }
//       public get y() {
//         return parentThis.playerEntity.y;
//       }
//       public set y(value) {
//         parentThis.playerEntity.y = value;
//       }
//       public tick = 0;
//       public _relativeMouseAngle = 0;
//       public set relativeMouseAngle(value: number) {
//         // console.log((value + 360) % 360);
//         this._relativeMouseAngle = value;
//         parentThis.playerWand.angle = value;
//       }
//       public get relativeMouseAngle() {
//         return this._relativeMouseAngle;
//       }
//     })();
//   })(this);

//   constructor(
//     private scene: Scene,
//     private playerEntity: XYTransformable & Destroyable,
//     private playerWand: XYTransformable & Rotatable & Destroyable,
//     spawnedProjectileHandler?: InputHandler<IPlayerInput>
//   ) {
//     this.playerInputHandler =
//       spawnedProjectileHandler ||
//       new SpawnedProjectileInputHandler(this.scene, this.playerWand);
//   }

//   public getCurrentInput(currentTick: number): IPlayerInput {
//     this.playerInputHandler.updateCurrentInput(currentTick);
//     return this.playerInputHandler.getCurrentInput();
//   }

//   public destroy() {
//     this.playerEntity.destroy();
//     this.playerWand.destroy();
//   }

//   public reconcileState(stateRef: IPlayerState) {
//     let historicalInput: IPlayerInput | undefined;

//     while ((historicalInput = this.playerInputHandler.getBuffer().shift())) {
//       if (stateRef.tick === historicalInput.tick) {
//         Object.assign(this.state, stateRef);
//         for (const v of this.playerInputHandler.getBuffer().iterable()) {
//           playerStateModification(v, this.state);
//         }
//         break;
//       }
//     }
//   }

//   public tick() {
//     playerStateModification(
//       this.playerInputHandler.getCurrentInput(),
//       this.state
//     );

//     // this.scene.add.graphics().strokeCircle(
//     //   (16 * Math.cos(Math.PI * 2 * ((this.state.relativeMouseAngle + 360) % 360)/360)) + this.state.x + wandPivotOffset.x,
//     //   (16 * Math.sin(Math.PI * 2 * ((this.state.relativeMouseAngle + 360) % 360)/360)) + this.state.y + wandPivotOffset.y,
//     //   1
//     // );
//   }
// }
