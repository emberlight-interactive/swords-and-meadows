import { Entity, System, system } from '@lastolivegames/becsy';
import {
  IXYTransform,
  XYTransform,
} from '../../../shared/components/xy-transform';
import { Queue } from '../../../shared/util/queue';
import { keyGen } from '../../../shared/util/key-gen';

type TrackedObject<T> = T & { onChange(callback: () => void): void };

interface NetworkedMap<T> {
  onAdd(callback: (state: TrackedObject<T>, key: string) => void): void;
  onRemove(callback: (item: T, key: string) => void): void;
}

@system
export class RecieveMutatedState extends System {
  private networkedXYTransformMap!: NetworkedMap<IXYTransform>;
  private networkedXYTransformsToAdd = new Queue<{
    trackedObject: TrackedObject<IXYTransform>;
    key: string;
  }>();
  private networkedXYTransformsToSync = new Queue<{
    updatedObject: IXYTransform;
    key: string;
  }>();
  private networkedXYTransformsToRemove = new Queue<string>();

  private networkedXYTransforms = this.query(q => {
    q.added.with(XYTransform).write.read;
  });

  private networkedEntities = new Map<string, Entity>();

  private clientId!: string;
  private keyGen = keyGen;

  public execute(): void {
    this.registerAddedComponents();
    this.handleNetworkAdditions();
    this.handleNetworkChanges();
    this.handleNetworkRemovals();
  }

  private registerAddedComponents() {
    for (const entity of this.networkedXYTransforms.added) {
      this.networkedEntities.set(
        this.keyGen.generate(this.clientId),
        entity.hold()
      );
    }
  }

  private handleNetworkAdditions() {
    let networkedXYTransform;
    while ((networkedXYTransform = this.networkedXYTransformsToAdd.shift())) {
      const entity = this.networkedEntities.get(networkedXYTransform.key);
      if (entity) {
        const xyTransform = entity.write(XYTransform);
        xyTransform.x = networkedXYTransform.trackedObject.x;
        xyTransform.y = networkedXYTransform.trackedObject.y;
      } else {
        const newEntity = this.createEntity(XYTransform, {
          x: networkedXYTransform.trackedObject.x,
          y: networkedXYTransform.trackedObject.y,
        });

        this.networkedEntities.set(networkedXYTransform.key, newEntity.hold());
      }

      networkedXYTransform.trackedObject.onChange(() => {
        this.networkedXYTransformsToSync.push({
          updatedObject: networkedXYTransform!.trackedObject,
          key: networkedXYTransform!.key,
        });
      });
    }
  }

  private handleNetworkChanges() {
    let networkedXYTransform;
    while ((networkedXYTransform = this.networkedXYTransformsToSync.shift())) {
      const entity = this.networkedEntities.get(networkedXYTransform.key);
      if (entity) {
        const xyTransform = entity.write(XYTransform);
        xyTransform.x = networkedXYTransform.updatedObject.x;
        xyTransform.y = networkedXYTransform.updatedObject.y;
      }
    }
  }

  public handleNetworkRemovals() {
    let entityKey;
    while ((entityKey = this.networkedXYTransformsToRemove.shift())) {
      const entity = this.networkedEntities.get(entityKey);
      entity?.remove(XYTransform);
      entity?.delete(); /** @todo will we ever network components and have a need for the original entity? */
    }
  }

  public initialize(): void {
    this.networkedXYTransformMap.onAdd((addedXYTransform, key) => {
      this.networkedXYTransformsToAdd.push({
        trackedObject: addedXYTransform,
        key,
      });
    });

    this.networkedXYTransformMap.onRemove((_, key) => {
      this.networkedXYTransformsToRemove.push(key);
    });
  }
}
