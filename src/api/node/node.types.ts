import { Node } from './node.entity';
export enum NodeStatus {
  Running = 'running',
  Deactive = 'deactive',
}

export interface ICreateNodeResponse {
  node: Node;
  privateKey: string;
  nodeId: string;
}
