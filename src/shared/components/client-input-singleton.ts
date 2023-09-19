import { component, field, Type } from '@lastolivegames/becsy';

export interface ClientMovementInput {
  up: boolean;
  left: boolean;
  down: boolean;
  right: boolean;
}

export interface ClientPointerInput {
  mouseWorldX: number;
  mouseWorldY: number;
}

export interface ClientInput extends ClientMovementInput, ClientPointerInput {}

@component
export class ClientInputSingleton implements ClientInput {
  @field({ type: Type.boolean })
  public declare up: boolean;

  @field({ type: Type.boolean })
  public declare left: boolean;

  @field({ type: Type.boolean })
  public declare down: boolean;

  @field({ type: Type.boolean })
  public declare right: boolean;

  @field({ type: Type.float64 })
  public declare mouseWorldX: number;

  @field({ type: Type.float64 })
  public declare mouseWorldY: number;
}
