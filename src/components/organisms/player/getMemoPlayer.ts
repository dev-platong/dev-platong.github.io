import React from "react"
import { IPlayerProps } from "./IPlayerProps";

export function getMemoPlayer(playerComponent: React.FC<IPlayerProps>): React.NamedExoticComponent<IPlayerProps> {
  return React.memo(playerComponent)
}