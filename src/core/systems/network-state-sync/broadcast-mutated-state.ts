import { System, system } from '@lastolivegames/becsy';
import {
  IXYTransform,
  XYTransform,
} from '../../../shared/components/xy-transform';
import { ClientInfo } from '../../../shared/components/client-info';
import { keyGen } from '../../../shared/util/key-gen';
import { XYTransformState } from '../../../shared/network/networked-xy-transform-state';
import { EntityKey } from '../../../shared/components/entity-key';

@system
export class BroadcastMutatedState extends System {
  private xyTransformMap!: Map<string, IXYTransform>;
  private xyTransforms = this.query(q =>
    q.added.and.removed.with(ClientInfo).and.with(XYTransform)
  );

  private xyTransformChanges = this.query(
    q =>
      q.changed.with(ClientInfo).and.with(EntityKey).and.with(XYTransform)
        .trackWrites
  );

  private entitlements = this.query(q => q.using(EntityKey).write);

  private keyGen = keyGen;

  public execute(): void {
    this.handleChanges();
    this.handleRemovals();
    this.handleAdditions();
  }

  private handleAdditions() {
    for (const entity of this.xyTransforms.added) {
      const clientInfo = entity.read(ClientInfo);
      const transform = entity.read(XYTransform);

      const xyTransformState = new XYTransformState();
      xyTransformState.x = transform.x;
      xyTransformState.y = transform.y;

      const newKey = this.keyGen.generate(clientInfo.clientId);
      entity.add(EntityKey, { value: newKey });

      this.xyTransformMap.set(
        this.keyGen.generate(clientInfo.clientId),
        xyTransformState
      );
    }
  }

  private handleRemovals() {
    for (const entity of this.xyTransforms.removed) {
      this.accessRecentlyDeletedData();
      const entityKey = entity.read(EntityKey);
      this.xyTransformMap.delete(entityKey.value);
    }
  }

  private handleChanges() {
    for (const entity of this.xyTransformChanges.changed) {
      const xyTransform = entity.read(XYTransform);
      const entityKey = entity.read(EntityKey);
      const tranformState = this.xyTransformMap.get(entityKey.value)!;
      tranformState.x = xyTransform.x;
      tranformState.y = xyTransform.y;
    }
  }
}
