import { NetworkedMap } from '../models/networked-map';
import { IExplosionState } from './explosion';
import { IPlayerState } from './player';
import { IProjectileState } from './projectile';

export interface INetworkedState {
  players: NetworkedMap<IPlayerState>;
  projectiles: NetworkedMap<IProjectileState>;
  explosions: NetworkedMap<IExplosionState>;
}
