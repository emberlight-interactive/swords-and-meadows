import { NetworkedMap } from '../models/networked-map';
import { IPlayerState } from './player';
import { IProjectileState } from './projectile';

export interface INetworkedState {
  players: NetworkedMap<IPlayerState>;
  projectiles: NetworkedMap<IProjectileState>;
}
