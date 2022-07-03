import { Node } from './node.entity';
export enum NodeStatus {
  Running = 'running',
  Deactive = 'deactive',
}

export interface HOME_DOMAIN {
  home_domain: string;
  quality: string;
}
export interface ICreateNodeResponse {
  node: Node;
  privateKey: string;
  nodeId: string;
}

export interface ICreateStellarNodeRequest {
  node_name: string;
  peer_port: string;
  http_port: string;
  passphrase: string;
  home_domains: HOME_DOMAIN[];
}
